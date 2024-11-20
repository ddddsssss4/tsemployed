import type { Request, Response } from 'express';
import db from '../lib/db';
//from this end-point you will get the basic information about the students . This all information is for the card we are creating as soon as the teacher is entering the
//homepage
export const getCardData = async (req: Request, res: Response) => {
  const teacherId = req.params.teacherId
  console.log(teacherId);
  try
  {

    const teacher = await db.teacher.findUnique({
          where: {
            id: teacherId,
          },
          select: {
            uniqueId: true,
          },
        });
    console.log(teacher);

    const students = await db.student.findMany({
      where: {
        teacher:{
          uniqueId:teacher?.uniqueId
        }
      },
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
        for (const subLevelProgress of currentLevel.subLevelProgress) {
            totalPassCount += subLevelProgress.passCount;
            totalFailCount += subLevelProgress.failCount;
        }


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






//This is about as soon as you enter the card you will get all that inforamtion in here
export const cardDetails = async(req:Request,res:Response) =>{
  try {
    const studentId = Number.parseInt(req.params.studentId);

    // Fetch the student details using the studentId
    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { name: true ,email:true }, // Select only the student's name
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
      // Calculate pass and fail counts for the current level's sub-levels

      for (const subLevel of progress.subLevelProgress) {
          levelPassCount += subLevel.passCount; // Add to pass count
          levelFailCount += subLevel.failCount; // Add to fail count
      }


      return {
        levelId,
        passCount: levelPassCount,
        failCount: levelFailCount,
      };
    });

    // Return the student's name along with pass and fail counts for each level
    return res.status(200).json({
      studentName: student.name,
      studentEmail:student.email,
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
}
