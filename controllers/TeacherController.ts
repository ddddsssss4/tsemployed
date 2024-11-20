import type { Request, Response } from "express";
import { z } from "zod";
import db from "../lib/db";



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

      
    }

    res.json({ message: 'Level unlocked and sub-levels initialized' });

};
