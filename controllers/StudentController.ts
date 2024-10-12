import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../lib/db";
import * as zod from 'zod';

const createLevelSchema = zod.object({
  studentId: zod.number().nonnegative(),
  levelId: zod.number().nonnegative().optional(),
});

export const getAllStudents = async (req: Request, res: Response) => {
  const students = await db.student.findMany();
  res.json(students);
};
export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
 

  // Check if a user with this email already exists
  const existingUser = await db.student.findFirst({
    where: { email }
  });
  

  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists." });
  } else {
    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new student
      const user = await db.student.create({
        data: { email, password: hashedPassword }
      });

      // Ensure Level 1 exists and create it if not
      let level = await db.level.findFirst({
        where: { levelNumber: 1 } // Assuming level 1
      });

      if (!level) {
        level = await db.level.create({
          data: { levelNumber: 1 }
        });
      }

      // Create LevelProgress for the user for Level 1
     
      return res.status(201).json({
        message: 'Student created successfully with level progress.',
        student: user
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while creating the student.' });
    }
  }
};
