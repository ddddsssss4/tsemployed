import type { Request, Response } from 'express';
import db from '../lib/db';

export const getData = async (req: Request, res: Response) => {
  try {
    const students = await db.student.findMany({
      include: {
        levelProgress: {
          include: {
            level: true,
            subLevelProgress: {
              include: {
                subLevel: true,
              },
            },
          },
        },
      },
    });

    const studentsWithAccuracyAndHighestLevel = students.map(student => {
      let totalPassCount = 0;
      let totalFailCount = 0;

      const highestLevel = student.levelProgress.reduce((maxLevel, currentLevel) => {
        const currentLevelNumber = currentLevel.level.levelNumber;

        // Calculate pass and fail counts for accuracy
        currentLevel.subLevelProgress.forEach(subLevelProgress => {
          totalPassCount += subLevelProgress.passCount;
          totalFailCount += subLevelProgress.failCount;
        });

        return currentLevelNumber > maxLevel ? currentLevelNumber : maxLevel;
      }, 0); // Initial max level is set to 0

      const totalAttempts = totalPassCount + totalFailCount;
      const accuracy = totalAttempts > 0 ? (totalPassCount / totalAttempts) * 100 : 0;

      return {
        id: student.id,
        name: student.name,
        accuracy: accuracy.toFixed(2), // Keeping the accuracy up to 2 decimal places
        highestLevel,
      };
    });

    res.status(200).json(studentsWithAccuracyAndHighestLevel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};
