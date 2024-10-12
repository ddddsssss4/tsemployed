import type { Request, Response } from "express";
import { z } from "zod";
import db from "../lib/db";


// export const studentAttempt = async (req: Request, res: Response) => {
//   try {
//     const validatedData = attemptSchema.parse(req.body);
//     const { accuracyScore, pronunciationScore, fluencyScore, completnessScore, level, studentId } = validatedData;

//     // Find the StudentLevel for the student and level
//     const studentLevel = await db.studentLevel.findFirst({
//       where: {
//         studentId,
//         attempts: {
//           some: { levelId },
//         },
//       },
//       include: {
//         attempts: true,
//       },
//     });

//     if (!studentLevel) {
//       return res.status(404).json({ message: "Student level not found" });
//     }

//     // Find the attempt at the specified level
//     const attempt = studentLevel.attempts.find((a) => a.levelId === levelId);

//     if (!attempt) {
//       return res.status(404).json({ message: "Attempt not found" });
//     }

//     // Calculate the average score
//     const averageScore = calculateAverageScore(accuracyScore, pronunciationScore, fluencyScore, completnessScore);

//     // Update the attempt
//     const updatedAttempt = await db.attempt.update({
//       where: {
//         id: attempt.id,
//       },
//       data: {
//         accuracyScore,
//         pronunciationScore,
//         fluencyScore,
//         completnessScore,
//         score: averageScore.toFixed(2),
//       },
//     });

//     // If average score is above 8.5, increment the current level
//     if (averageScore > 8.5) {
//       await db.studentLevel.update({
//         where: { id: studentLevel.id },
//         data: { currentLevel: studentLevel.currentLevel + 1 },
//       });
//     }

//     return res.json(updatedAttempt);
//   } catch (error) {
//     //@ts-expect-error
//     return res.status(400).json({ error: error.message });
//   }
// };

// // Function to calculate the average score
// const calculateAverageScore = (
//   accuracyScore: string,
//   pronunciationScore: string,
//   fluencyScore: string,
//   completnessScore: string
// ): number => {
//   const scores = [
//     parseFloat(accuracyScore),
//     parseFloat(pronunciationScore),
//     parseFloat(fluencyScore),
//     parseFloat(completnessScore),
//   ];
//   const totalScore = scores.reduce((acc, score) => acc + score, 0);
//     return totalScore / scores.length;
// };



export const createAttempt = async (req: Request, res: Response) => {

    const { studentId, levelId } = req.body;
    const { numberOfSubLevels } = req.body;

    // Ensure the level is unlocked
    const levelProgress = await db.levelProgress.findFirst({
        where: { studentId, levelId, completed: false }
    });

    if (!levelProgress) {
        return res.status(400).json({ message: 'Level is not unlocked or already completed' });
    }

    // Fetch or create sub-level progress records based on the provided number of sublevels
    const existingSubLevelCount = await db.subLevelProgress.count({
        where: { levelProgressId: levelProgress.id }
    });

    if (existingSubLevelCount < numberOfSubLevels) {
        const subLevels = Array.from({ length: numberOfSubLevels }, (_, index) => ({
            levelProgressId: levelProgress.id,
            subLevel: {
                create: {
                    name: `SubLevel ${index + 1}`,
                    description: `Description for SubLevel ${index + 1}`
                }
            }
        }));

        // await db.subLevelProgress.createMany({
        //     data: subLevels
        // });
    }

    res.json({ message: 'Level unlocked and sub-levels initialized' });

};
