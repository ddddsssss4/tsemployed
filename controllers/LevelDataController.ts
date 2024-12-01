 import type { Request, Response } from "express";
import db from '../lib/db';

export const LevelData = async (req: Request, res: Response) => {
  try {
    const studentId = Number.parseInt(req.params.studentId);
    const resultFilter = req.query.result as string; // Get the result query parameter

    // Fetch the student data with their sub-level progress
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        levelProgress: {
          include: {
            subLevelProgress: true, // Include sub-level progress to access accuracy, pronunciation, and fluency
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Initialize totals and counters
    let totalCompleteness  = 0.0;
    let totalPronunciation = 0.0;
    let totalFluency = 0.0;
    let subLevelCount = 0.0;

    // Iterate over levelProgress and subLevelProgress
    for (const levelProgress of student.levelProgress) {
      for (const subLevelProgress of levelProgress.subLevelProgress) {
        // Filter based on the result query parameter
        const passed = subLevelProgress.passCountAzure > 0;
        const failed = subLevelProgress.failCountAzure > 0;
    
        if (
          (resultFilter === 'pass' && passed) ||
          (resultFilter === 'fail' && failed) ||
          !resultFilter // If no filter is provided, include all
        ) {
          // @ts-ignore
          totalCompleteness += subLevelProgress.completenessAzure;
          // @ts-ignore
          totalPronunciation += subLevelProgress.pronunciationAzure;
          // @ts-ignore
          totalFluency += subLevelProgress.fluencyAzure;
          subLevelCount++;
        }
      }
    }


    // Calculate the averages
    const averageCompleteness = subLevelCount > 0 ? (totalCompleteness / subLevelCount).toFixed(2) : 0;
    const averagePronunciation = subLevelCount > 0 ? (totalPronunciation / subLevelCount).toFixed(2) : 0;
    const averageFluency = subLevelCount > 0 ? (totalFluency / subLevelCount).toFixed(2) : 0;
    console.log(student.id);
    console.log(student.name);
    console.log(averageCompleteness);
    console.log(averageFluency);
    console.log(averagePronunciation);
   

    // Return the averages
    res.status(200).json({
      studentId: student.id,
      name: student.name,
      averageCompleteness:averageCompleteness,
      averagePronunciation:averagePronunciation,
      averageFluency:averageFluency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
};

export const levelDataCustom = async (req: Request , res: Response) => {
  try {
   const studentId = Number.parseInt(req.params.studentId);
   const resultFilter = req.query.result as string;
   //Now we are fatching the student with their sublevel progress
   const student = await db.student.findUnique({
    where : {
      id: studentId
    },
    include :{
      levelProgress :{
        include :{
          subLevelProgress : true
        },
      },
    },
   })

   if(!student){
    return res.status(404).json({error : "student not found "});
   }

   let totalCompleteness = 0.0;
   let totalFluency = 0.0;
   let subLevelCount = 0.0;
   let totalPronunciation = 0.0;

   for(const levelProgress of student.levelProgress){
    for(const subLevelProgress of levelProgress.subLevelProgress){
      const passed = subLevelProgress.passCountCustom > 0;
      const failed = subLevelProgress.failCountCustom > 0;

      if(
        (resultFilter === 'pass' && passed) ||
        (resultFilter === 'fail' && failed) ||
        !resultFilter // If no filter is provided, include all
      ){
        // @ts-ignore
        totalCompleteness += subLevelProgress.completenessCustom;
        // @ts-ignore
        totalPronunciation += subLevelProgress.pronunciationCustom;
        // @ts-ignore
        totalFluency += subLevelProgress.fluencyCustom;
        subLevelCount++;
      }
      

    }
   }

   const averageCompleteness = subLevelCount > 0 ? (totalCompleteness / subLevelCount).toFixed(2) : 0;
   const averagePronunciation = subLevelCount > 0 ? (totalPronunciation / subLevelCount).toFixed(2) : 0;
   const averageFluency = subLevelCount > 0 ? (totalFluency / subLevelCount).toFixed(2) : 0;

   res.status(200).json({
    studentId: student.id,
    name: student.name,
    averageCompleteness:averageCompleteness,
    averagePronunciation:averagePronunciation,
    averageFluency:averageFluency,
   })
  }catch(error){
    console.log(error);
  }
}

