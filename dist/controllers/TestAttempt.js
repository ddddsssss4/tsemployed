"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAttemptAzure = void 0;
const db_1 = __importDefault(require("../lib/db"));
const testAttemptAzure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { total_score, levelId, sublevelNo, studentId, pronunciation, fluency, completeness, languageModelID, } = req.body;
    if (!total_score || !levelId || !sublevelNo || !studentId || !languageModelID) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        // Fetch level progress for the student
        const levelProgress = yield db_1.default.levelProgress.findMany({
            where: {
                studentId: Number.parseInt(studentId),
                levelId: Number.parseInt(levelId),
            },
        });
        if (!levelProgress) {
            return res.status(404).json({ message: "Level Progress not found for the student." });
        }
        // Fetch the sublevel based on levelId and sublevelNo
        const subLevel = yield db_1.default.subLevel.findFirst({
            where: {
                levelId: Number.parseInt(levelId),
                order: Number.parseInt(sublevelNo),
            },
        });
        if (!subLevel) {
            return res.status(404).json({ error: 'Sub-level not found' });
        }
        // Fetch or create sublevel progress record for the specific language model
        let subLevelProgress = yield db_1.default.subLevelProgress.findFirst({
            where: {
                levelProgressId: levelProgress[0].id,
                subLevelId: subLevel.id,
                langaugeModelID: languageModelID, // Match based on language model ID
            },
        });
        console.log(subLevelProgress);
        if (subLevelProgress !== null) {
            // Update existing record
            subLevelProgress = yield db_1.default.subLevelProgress.update({
                where: { id: subLevelProgress.id },
                data: {
                    scoreAzure: Number.parseFloat(total_score),
                    pronunciationAzure: Number.parseFloat(pronunciation),
                    fluencyAzure: Number.parseFloat(fluency),
                    completenessAzure: Number.parseFloat(completeness),
                    completed: Number.parseFloat(total_score) >= 8.5,
                    attemptsAzure: {
                        increment: 1,
                    },
                    passCountAzure: total_score >= 8.5 ? { increment: 1 } : undefined,
                    failCountAzure: total_score < 8.5 ? { increment: 1 } : undefined,
                },
            });
            console.log("going in else");
        }
        else {
            // Create a new record
            subLevelProgress = yield db_1.default.subLevelProgress.create({
                data: {
                    levelProgressId: levelProgress[0].id,
                    subLevelId: subLevel.id,
                    scoreAzure: Number.parseFloat(total_score),
                    pronunciationAzure: Number.parseFloat(pronunciation),
                    fluencyAzure: Number.parseFloat(fluency),
                    completenessAzure: Number.parseFloat(completeness),
                    completed: false,
                    attemptsAzure: 1,
                    passCountAzure: Number.parseFloat(total_score) >= 8.5 ? 1 : 0,
                    failCountAzure: Number.parseFloat(total_score) < 8.5 ? 1 : 0,
                    langaugeModelID: languageModelID, // Assign the provided language model ID
                },
            });
        }
        // Check if all sublevels in this level are completed
        const totalSubLevels = yield db_1.default.subLevel.count({
            where: { levelId: Number.parseInt(levelId) },
        });
        const completedSubLevels = yield db_1.default.subLevelProgress.count({
            where: {
                levelProgressId: levelProgress[0].id,
                completed: true,
            },
        });
        if (completedSubLevels === totalSubLevels) {
            // Mark the level as completed
            yield db_1.default.levelProgress.update({
                where: { id: levelProgress[0].id },
                data: { completed: true },
            });
            // Check if there's a next level and create it if necessary
            const existingLevel = yield db_1.default.level.findUnique({
                where: { id: Number.parseInt(levelId) },
            });
            if (!existingLevel) {
                throw new Error(`Level with ID ${levelId} not found.`);
            }
            const nextLevelNumber = existingLevel.levelNumber + 1;
            const nextLevel = yield db_1.default.level.findUnique({
                where: { levelNumber: nextLevelNumber },
            });
            if (!nextLevel) {
                // Create a new level
                yield db_1.default.level.create({
                    data: {
                        levelNumber: nextLevelNumber,
                        // Add other necessary fields for the new level
                    },
                });
                console.log('New level created:', nextLevel);
            }
        }
        console.log("at the last");
        // Respond with success and the updated sub-level progress
        res.status(200).json({ message: 'Test attempt recorded successfully.', subLevelProgress });
    }
    catch (error) {
        console.error(error);
        //@ts-ignore
        console.log("at the end ", error.message);
        res.status(500).json({ error: 'An error occurred while processing the test attempt.' });
    }
});
exports.testAttemptAzure = testAttemptAzure;
//Test Attempt with the custom engine 
// export const testAttemptCustom = async (req: Request, res: Response) => {
//   const { total_score, levelId, sublevelNo, studentId, pronunciation, fluency, completeness } = req.body;
//   console.log("Inside controller of test attempt");
//   console.log(req.body);
//   if (!total_score || !levelId || !sublevelNo || !studentId) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }
//   try {
//     // Fetch level progress for the student
//     const levelProgress = await db.levelProgress.findUnique({
//       where: {
//         studentId_levelId: {
//           studentId: Number.parseInt(studentId),
//           levelId: Number.parseInt(levelId),
//         },
//       },
//     });
//     if (!levelProgress) {
//       return res.status(404).json({ message: "Level Progress not found for the student." });
//     }
//     // Fetch the sublevel based on levelId and sublevelNo
//     const subLevel = await db.subLevel.findFirst({
//       where: {
//         levelId: Number.parseInt(levelId),
//         order: Number.parseInt(sublevelNo),
//       },
//     });
//     if (!subLevel) {
//       return res.status(404).json({ error: 'Sub-level not found' });
//     }
//     // Fetch or create sublevel progress record
//     let subLevelProgress = await db.subLevelProgress.findFirst({
//       where: {
//         levelProgressId: levelProgress.id,
//         subLevelId: subLevel.id,
//       },
//     });
//     if (subLevelProgress) {
//       // Calculate the average score
//       const a =subLevelProgress.scoreAzure;
//       const averageScore = (Number.parseFloat(total_score) + a) / 2; // (total_score + a) / 2;
//       // Update existing record
//       subLevelProgress = await db.subLevelProgress.update({
//         where: { id: subLevelProgress.id },
//         data: {
//           scoreCustom: Number.parseFloat(total_score),
//           pronunciationCustom: Number.parseFloat(pronunciation),
//           fluencyCustom: Number.parseFloat(fluency),
//           completenessCustom: Number.parseFloat(completeness),
//           completed: averageScore >= 8.5, // Mark as completed if average score is high enough
//           attemptsCustom: {
//             increment: 1,
//           },
//           passCountCustom: total_score >= 8.5 ? { increment: 1 } : undefined,
//           failCountCustom: total_score < 8.5 ? { increment: 1 } : undefined,
//         },
//       });
//     }
//     else {
//       // Create a new record
//       subLevelProgress = await db.subLevelProgress.create({
//         data: {
//           levelProgressId: levelProgress.id,
//           subLevelId: subLevel.id,
//           scoreCustom: Number.parseFloat(total_score),
//           pronunciationCustom: Number.parseFloat(pronunciation),
//           fluencyCustom: Number.parseFloat(fluency),
//           completenessCustom: Number.parseFloat(completeness),
//           completed: false,
//           attemptsCustom: 1,
//           passCountCustom: Number.parseFloat(total_score) >= 8.5 ? 1 : 0,
//           failCountCustom: Number.parseFloat(total_score) < 8.5 ? 1 : 0,
//           scoreAzure: Number.parseFloat("0.0"),
//         },
//       });
//     }
//     // Check if all sublevels in this level are completed
//     const totalSubLevels = await db.subLevel.count({
//       where: { levelId: Number.parseInt(levelId) },
//     });
//     const completedSubLevels = await db.subLevelProgress.count({
//       where: {
//         levelProgressId: levelProgress.id,
//         completed: true,
//       },
//     });
//     if (completedSubLevels === totalSubLevels) {
//       // Mark the level as completed
//       await db.levelProgress.update({
//         where: { id: levelProgress.id },
//         data: { completed: true },
//       });
//       // Check if there's a next level and create it if necessary
//       const existingLevel = await db.level.findUnique({
//         where: { id: Number.parseInt(levelId) },
//       });
//       if (!existingLevel) {
//         throw new Error(`Level with ID ${levelId} not found.`);
//       }
//       const nextLevelNumber = existingLevel.levelNumber + 1;
//       const nextLevel = await db.level.findUnique({
//         where: { levelNumber: nextLevelNumber },
//       });
//       if (!nextLevel) {
//         // Create a new level
//         await db.level.create({
//           data: {
//             levelNumber: nextLevelNumber,
//             // Add other necessary fields for the new level
//           },
//         });
//         console.log('New level created:', nextLevel);
//       }
//     }
//     console.log("at the last");
//     // Respond with success and the updated sub-level progress
//     res.status(200).json({ message: 'Test attempt recorded successfully.', subLevelProgress });
//   } catch (error) {
//     console.error(error);
//     //@ts-ignore
//     console.log("at the end ", error.message);
//     res.status(500).json({ error: 'An error occurred while processing the test attempt.' });
//   }
// };
