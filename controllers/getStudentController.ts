import type { Request, Response } from 'express';
import db from '../lib/db';
//from this end-point you will get the basic information about the students . This all information is for the card we are creating as soon as the teacher is entering the
//homepage
export const cardData = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId;
    const languageModelId = req.params.languageModelId;

    const students = await db.student.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        levelProgress: {
          include: {
            subLevelProgress: {
              where: {
                langaugeModelID: languageModelId,
              },
            },
          },
        },
      },
    });

    const studentsWithLanguageModelData = students.map((student) => {
      let totalPassCount = 0;
      let totalFailCount = 0;

      student.levelProgress.forEach((levelProgress) => {
        levelProgress.subLevelProgress.forEach((subLevelProgress) => {
          totalPassCount += subLevelProgress.passCountAzure;
          totalFailCount += subLevelProgress.failCountAzure;
        });
      });

      const totalAttempts = totalPassCount + totalFailCount;
      const accuracy = totalAttempts > 0 ? (totalPassCount / totalAttempts) * 100 : 0;

      return {
        id: student.id,
        name: student.name,
        totalPassCount,
        totalFailCount,
        accuracy: accuracy.toFixed(2),
      };
    });

    res.status(200).json(studentsWithLanguageModelData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};










//This is about as soon as you enter the card you will get all that inforamtion in here
export const cardDetails = async (req: Request, res: Response) => {
  try {
    const studentId = Number.parseInt(req.params.studentId);
    const languageModelId = req.params.languageModelId;

    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { name: true, email: true },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const levelProgress = await db.levelProgress.findMany({
      where: { studentId },
      include: {
        subLevelProgress: {
          where: {
            langaugeModelID: languageModelId,
          },
        },
      },
    });

    let totalPassCount = 0;
    let totalFailCount = 0;
    const levels: any[] = [];

    levelProgress.forEach((progress) => {
      let levelPassCount = 0;
      let levelFailCount = 0;

      progress.subLevelProgress.forEach((subLevelProgress) => {
        levelPassCount += subLevelProgress.passCountAzure;
        levelFailCount += subLevelProgress.failCountAzure;
      });

      if (levelPassCount > 0 || levelFailCount > 0) {
        levels.push({
          levelId: progress.levelId,
          passCount: levelPassCount,
          failCount: levelFailCount,
        });
      }

      totalPassCount += levelPassCount;
      totalFailCount += levelFailCount;
    });

    return res.status(200).json({
      studentName: student.name,
      studentEmail: student.email,
      languageModelId,
      totalPassCount,
      totalFailCount,
      levels,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




// export const getCardDataCustom = async (req:Request , res:Response) =>{
//   const teacherId = req.params.teacherId
//   console.log(teacherId);
//   try{
//     const students = await db.student.findMany({
//       where:{
//         teacherId:teacherId
//       },
//       include:{
//         levelProgress:{
//           include:{
//             level:true,
//             subLevelProgress:{
//               include:{
//                 subLevel:true,
//               }
//             }
//           }
//         }
//       }
//     });

//     const studentsWithAccuracyAndHighestLevel = students.map((student)=>{
//       let toealPassCount =0;
//       let totalFailCount =0;

//       const highestLevel = student.levelProgress.reduce((maxLevel, currentLevel)=>{
//         const currentLevelNumber = currentLevel.level.levelNumber;
//         for(const subLevelProgress of currentLevel.subLevelProgress){  
//           toealPassCount += subLevelProgress.passCountCustom;  
//           totalFailCount += subLevelProgress.failCountCustom;  
//         }
//         return currentLevelNumber > maxLevel ? currentLevelNumber : maxLevel;
//       },0);

//       const totalAttempts = toealPassCount + totalFailCount;
//       const accuracy = totalAttempts > 0 ? (toealPassCount / totalAttempts) * 100 : 0;

//       return{
//         id:student.id,
//         name:student.name,  
//         accuracy:accuracy.toFixed(2),
//         highestLevel:highestLevel
//       }
//     })

//     res.status(200).json(studentsWithAccuracyAndHighestLevel)
//   }catch(error){
//     console.error(error);
//     res.status(500).json({error:"Failed to fetch students"})
//   }
// };

// export const cardDetailsCustom = async(req:Request,res:Response) =>{
//   try {
//     const studentId = Number.parseInt(req.params.studentId);

//     // Fetch the student details using the studentId
//     const student = await db.student.findUnique({
//       where: { id: studentId }, 
//       select: { name: true ,email:true }, // Select only the student's name
//     }); 

//     if (!student) { 
//       return res.status(404).json({ error: 'Student not found' });
//     } 

//     // Fetch all levels and their sub-level progress for the given student ID   
//     const levelProgress = await db.levelProgress.findMany({
//       where: { studentId },
//       include: {
//         level: {
//           include: {
//             subLevels: true, // Include sub-levels in the level data
//           },
//         },
//         subLevelProgress: true,
//       },
//     });

//     // Prepare an object to hold pass and fail counts for each level  
//     const levelsWithCounts = levelProgress.map((progress) => {
//       const levelId = progress.level.id;
//       let levelPassCount = 0;
//       let levelFailCount = 0;
//       // Calculate pass and fail counts for the current level's sub-levels
//       progress.subLevelProgress.forEach((subLevel) => {
//         levelPassCount += subLevel.passCountCustom; // Add to pass count
//         levelFailCount += subLevel.failCountCustom; // Add to fail count
//       });

//       return {
//         levelId,
//         passCount: levelPassCount,
//         failCount: levelFailCount,
//       };
//     });

//     // Return the student's name along with pass and fail counts for each level 
//     return res.status(200).json({
//       studentName: student.name,
//       studentEmail:student.email,
//       levelsWithCounts: levelsWithCounts.map(level => ({
//         levelId: level.levelId,
//         passCount: level.passCount,
//         failCount: level.failCount,
//       })),  
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });  
//   }
// }
