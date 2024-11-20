import type { Request, Response } from "express";
import db from '../lib/db';

export const testAttempt = async (req: Request, res: Response) => {
  const { total_score, levelId, sublevelNo, studentId, pronunciation, fluency, completeness } = req.body;

  console.log("Inside controller of test attempt");
  
  console.log(req.body);

  if (!total_score || !levelId || !sublevelNo || !studentId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Fetch level progress for the student
    const levelProgress = await db.levelProgress.findUnique({
      where: {
        studentId_levelId: {
          studentId: Number.parseInt(studentId),
          levelId: Number.parseInt(levelId),
        },
      },
    });

    if (!levelProgress) {
      return res.status(404).json({ message: "Level Progress not found for the student." });
    }

    // Fetch the sublevel based on levelId and sublevelNo
    const subLevel = await db.subLevel.findFirst({
      where: {
        levelId: Number.parseInt(levelId),
        order: Number.parseInt(sublevelNo),
      },
    });

    if (!subLevel) {
      return res.status(404).json({ error: 'Sub-level not found' });
    }

    // Fetch or create sublevel progress record
    let subLevelProgress = await db.subLevelProgress.findFirst({
      where: {
        levelProgressId: levelProgress.id,
        subLevelId: subLevel.id,
      },
    });

    if (subLevelProgress) {
      // Update existing record
      subLevelProgress = await db.subLevelProgress.update({
        where: { id: subLevelProgress.id },
        data: {
          score: Number.parseFloat(total_score),
          pronunciation: Number.parseFloat(pronunciation),
          fluency: Number.parseFloat(fluency),
          completeness: Number.parseFloat(completeness),
          completed: Number.parseFloat(total_score) >= 8.5, // Mark as completed if score is high enough
          attempts: {
            increment: 1,
          },
          passCount: Number.parseFloat(total_score) >= 8.5 ? { increment: 1 } : undefined,
          failCount: Number.parseFloat(total_score) < 8.5 ? { increment: 1 } : undefined,
        },
      });
    } else {
      // Create a new record
      subLevelProgress = await db.subLevelProgress.create({
        data: {
          levelProgressId: levelProgress.id,
          subLevelId: subLevel.id,
          score: Number.parseFloat(total_score),
          pronunciation: Number.parseFloat(pronunciation),
          fluency: Number.parseFloat(fluency),
          completeness: Number.parseFloat(completeness),
          completed: Number.parseFloat(total_score) >= 8.5,
          attempts: 1,
          passCount: Number.parseFloat(total_score) >= 8.5 ? 1 : 0,
          failCount: Number.parseFloat(total_score) < 8.5 ? 1 : 0,
        },
      });
    }

    // Check if all sublevels in this level are completed
    const totalSubLevels = await db.subLevel.count({
      where: { levelId: Number.parseInt(levelId) },
    });

    const completedSubLevels = await db.subLevelProgress.count({
      where: {
        levelProgressId: levelProgress.id,
        completed: true,
      },
    });

    if (completedSubLevels === totalSubLevels) {
      // Mark the level as completed
      await db.levelProgress.update({
        where: { id: levelProgress.id },
        data: { completed: true },
      });

      // Check if there's a next level and create it if necessary
      const existingLevel = await db.level.findUnique({
        where: { id: Number.parseInt(levelId) },
      });

      if (!existingLevel) {
        throw new Error(`Level with ID ${levelId} not found.`);
      }

      const nextLevelNumber = existingLevel.levelNumber + 1;
      const nextLevel = await db.level.findUnique({
        where: { levelNumber: nextLevelNumber },
      });

      if (!nextLevel) {
        // Create a new level
        await db.level.create({
          data: {
            levelNumber: nextLevelNumber,
            // Add other necessary fields for the new level
          },
        });
        console.log('New level created:', nextLevel);
      }
    }
    console.log("at the last");
    

    // Respond with success and the updated sub-level progress
    res.status(200).json({ message: 'Test attempt recorded successfully.', subLevelProgress });

  } catch (error) {
    console.error(error);
    //@ts-ignore
    console.log("at the end ", error.message);
    
    res.status(500).json({ error: 'An error occurred while processing the test attempt.' });
  }
};
