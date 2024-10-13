import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../lib/db"; // Ensure the path is correct for your project

// Teacher Login
export const teacherLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const a = console.log(req.body)
  console.log(a)

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json(
      { error: "Email and password are required" ,a},
    
    ) ;
  }

  try {
    // Fetch the teacher using email
    const teacher = await db.teacher.findUnique({
      where: { email },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Login successful, return the teacher info
    return res.status(200).json({ message: "Login successful", teacher });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
};

// Teacher Signup
export const teacherSignup = async (req: Request, res: Response) => {
  const { email, password, name, teacherId } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !name || !teacherId) {
    return res.status(400).json({ error: "Email, password, name, and teacherId are required for signup." });
  }

  try {
    // Check if the teacher already exists
    const existingTeacher = await db.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return res.status(409).json({ error: "Teacher with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = await db.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        uniqueId: teacherId,
      },
    });

    // Registration successful, return the new teacher info
    return res.status(201).json({ message: "Teacher registered successfully", newTeacher });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during signup." });
  }
};
