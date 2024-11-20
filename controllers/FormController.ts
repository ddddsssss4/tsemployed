// src/controllers/studentDetailsController.ts

import type { Request, Response } from 'express';
import db from '../lib/db';

// POST route to submit student details
export const submitStudentDetails = async (req: Request, res: Response) => {
  console.log(1);
  const { studentId, age, favoriteColor, grade, skillLevel, ethnicity, background } = req.body;
  console.log(req.body);
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required.' });
  }

  try {
    // Check if student exists
    const student = await db.student.findUnique({
      where: { id: Number.parseInt(studentId) },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Create or update student details
    const studentDetail = await db.studentDetail.upsert({
      where: { studentId: Number.parseInt(studentId) },
      update: {
        age,
        favoriteColor,
        grade,
        skillLevel,
        ethnicity,
        background,
      },
      create: {
        studentId: Number.parseInt(studentId),
        age,
        favoriteColor,
        grade,
        skillLevel,
        ethnicity,
        background,
      },
    });

    res.status(200).json({ message: 'Student details saved successfully.', studentDetail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while saving student details.' });
  }
};

// GET route to retrieve student details
export const getStudentDetails = async (req: Request, res: Response) => {
  console.log(1);
  const {studentId} = req.params
  console.log(studentId);

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required.' });
  }

  try {
    const studentDetail = await db.studentDetail.findUnique({
      //@ts-ignore
      where: { studentId: Number.parseInt(studentId) },
    });

    if (!studentDetail) {
      return res.status(404).json({ error: 'Student details not found.' });
    }

    res.status(200).json({ studentDetail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving student details.' });
  }
};
