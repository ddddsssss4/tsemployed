import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../lib/db"; // Ensure this points to your database configuration
import * as zod from 'zod';

// Zod schema to validate student and level data
const createLevelSchema = zod.object({
  studentId: zod.number().nonnegative(),
  levelId: zod.number().nonnegative().optional(),
});

// Function to get all students
export const getAllStudents = async (req: Request, res: Response) => {
  const students = await db.student.findMany();
  res.json(students);
};

// Function for student signup
export const signUp = async (req: Request, res: Response) => {
  const { email, password, teacherId } = req.body;

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
        data: { email, password: hashedPassword, teacherId }
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
      // (This part will depend on your schema for LevelProgress)

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

// Function for student login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the student by email
    const student = await db.student.findUnique({
      where: { email }
    });

    if (!student) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Generate a JWT token upon successful login
    

    // Respond with the token and student data
    return res.status(200).json({
      message: "Login successful",
     
      student: {
        id: student.id,
        email: student.email,
        teacherId: student.teacherId
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
};
