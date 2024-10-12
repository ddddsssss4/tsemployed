import type { Request, Response } from "express";
import db from '../lib/db';

export const levelAttempt = async (req: Request, res: Response) => {
  const { studentId, sub_level, targetLevel } = req.body;

  if (!studentId || sub_level === undefined || !targetLevel) {
    return res.status(400).json({ error: "All fields are required" });
  }
  console.log(sub_level);

  try {
    // Fetch the student
    const student = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
   

    // Find the highest level the student has progressed to, if any
    const currentLevelProgress = await db.levelProgress.findFirst({
      where: { studentId },
      orderBy: { level: { levelNumber: 'desc' } },
      include: { level: true },
    });

    if (currentLevelProgress) {
      const currentLevelNumber = currentLevelProgress.level.levelNumber;
      console.log(currentLevelNumber);

      // Check if the student is trying to access a higher level than allowed
      if (targetLevel > currentLevelNumber + 1) {
        return res.status(403).json({ error: 'You cannot access a level higher than the current level.' });
      }
    } else {
      // If no level progress is found, set the current level number to 0
      if (targetLevel !== 1) {
        return res.status(400).json({ error: 'No level progress found. You must start at level 1.' });
      }
    }

    // Find the level
    const level = await db.level.findUnique({
      where: { levelNumber: targetLevel },
    });

    if (!level) {
      return res.status(404).json({ error: 'Target level not found.' });
    }

    // Find or create the level progress for the target level
    let levelProgress = await db.levelProgress.findUnique({
      where: {
        studentId_levelId: {
          studentId: studentId,
          levelId: level.id,
        },
      },
    });

    if (!levelProgress) {
      levelProgress = await db.levelProgress.create({
        data: {
          studentId,
          levelId: level.id,
          completed: false,
          score: 0.0,
          attempts: 0,
          passCount: 0,
          failCount: 0,
        },
      });
    }

    // Check if there are any existing sub-levels for this level
    const existingSubLevel = await db.subLevel.findFirst({
      where: { levelId: level.id },
    });
    console.log(existingSubLevel);
    

    if (!existingSubLevel) {
      // Create missing sub-levels only if none exist
      for (let i = 0; i < sub_level; i++) {
        await db.subLevel.create({
          data: {
            name: `SubLevel ${i + 1}`,
            content: `Content for sublevel ${i + 1}`,
            levelId: level.id,
            order: i + 1,
          },
        });
      }
    }

    const allSubLevels = await db.subLevel.findMany({
      where: { levelId: levelProgress.levelId },
      orderBy: { order: 'asc' },
    });

    // Create or update SubLevelProgress records for all relevant sub-levels
    for (let i = 0; i < sub_level; i++) {
      const sublevel = allSubLevels[i];

      let subLevelProgress = await db.subLevelProgress.findUnique({
        where: {
          levelProgressId_subLevelId: {
            levelProgressId: levelProgress.id,
            subLevelId: sublevel.id,
          },
        },
      });

      if (!subLevelProgress) {
        await db.subLevelProgress.create({
          data: {
            levelProgressId: levelProgress.id,
            subLevelId: sublevel.id,
            completed: false,
            score: 0.0,
            accuracy: 0,
            attempts: 0,
            passCount: 0,
            failCount: 0,
          },
        });
      } else {
        // Optionally update existing SubLevelProgress records
        await db.subLevelProgress.update({
          where: { id: subLevelProgress.id },
          data: {
            completed: subLevelProgress.completed,
            score: subLevelProgress.score,
            accuracy: subLevelProgress.accuracy,
            attempts: subLevelProgress.attempts,
            passCount: subLevelProgress.passCount,
            failCount: subLevelProgress.failCount,
          },
        });
      }
    }

    res.status(200).json({ message: 'Level attempt processed successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while attempting the new level.' });
  }
};
