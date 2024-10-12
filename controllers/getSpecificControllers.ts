import type { Request, Response } from 'express';
import db from '../lib/db';

export const specificStudentData = async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.id);

    // Fetch the student details using the studentId
    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { name: true }, // Select only the student's name
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch all levels and their sub-level progress for the given student ID
    const levelProgress = await db.levelProgress.findMany({
      where: { studentId },
      include: {
        level: {
          include: {
            subLevels: true, // Include sub-levels in the level data
          },
        },
        subLevelProgress: true,
      },
    });

    // Prepare an object to hold pass and fail counts for each level
    const levelsWithCounts = levelProgress.map((progress) => {
      const levelId = progress.level.id;
      let levelPassCount = 0;
      let levelFailCount = 0;

      // Calculate pass and fail counts for the current level's sub-levels
      progress.subLevelProgress.forEach((subLevel) => {
        levelPassCount += subLevel.passCount; // Add to pass count
        levelFailCount += subLevel.failCount; // Add to fail count
      });

      return {
        levelId,
        passCount: levelPassCount,
        failCount: levelFailCount,
      };
    });

    // Return the student's name along with pass and fail counts for each level
    return res.status(200).json({
      studentName: student.name,
      levelsWithCounts: levelsWithCounts.map(level => ({
        levelId: level.levelId,
        passCount: level.passCount,
        failCount: level.failCount,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
