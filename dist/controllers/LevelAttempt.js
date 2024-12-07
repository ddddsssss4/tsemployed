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
exports.levelAttempt = void 0;
const db_1 = __importDefault(require("../lib/db"));
const levelAttempt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, sub_level, targetLevel, langaugeModelID1, langaugeModelID2 } = req.body;
    console.log(req.body);
    if (!studentId || sub_level === undefined || !targetLevel) {
        return res.status(400).json({ error: "All fields are required" });
    }
    console.log(sub_level);
    try {
        // Fetch the student
        const student = yield db_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        // Find the highest level the student has progressed to, if any
        const currentLevelProgress = yield db_1.default.levelProgress.findFirst({
            where: { studentId },
            orderBy: { level: { levelNumber: 'desc' } },
            include: { level: true },
        });
        if (currentLevelProgress) {
            const currentLevelNumber = currentLevelProgress.level.levelNumber;
            console.log(currentLevelNumber);
            // Check if the student is trying to access a higher level than allowed
            if (targetLevel > currentLevelNumber + 1) {
                return res.status(403).json({ error: 'You cannot access a level higher than the current level.' });
            }
        }
        else {
            // If no level progress is found, set the current level number to 0
            if (targetLevel !== 1) {
                return res.status(400).json({ error: 'No level progress found. You must start at level 1.' });
            }
        }
        // Find the level
        const level = yield db_1.default.level.findUnique({
            where: { levelNumber: targetLevel },
        });
        if (!level) {
            return res.status(404).json({ error: 'Target level not found.' });
        }
        // Find or create the level progress for the target level
        let levelProgress = yield db_1.default.levelProgress.findUnique({
            where: {
                studentId_levelId: {
                    studentId: studentId,
                    levelId: level.id,
                },
            },
        });
        if (!levelProgress) {
            levelProgress = yield db_1.default.levelProgress.create({
                data: {
                    studentId,
                    levelId: level.id,
                    completed: false,
                    score: 0.0,
                },
            });
        }
        // Check if there are any existing sub-levels for this level
        const existingSubLevel = yield db_1.default.subLevel.findFirst({
            where: { levelId: level.id },
        });
        console.log(existingSubLevel);
        if (!existingSubLevel) {
            // Create missing sub-levels only if none exist
            for (let i = 0; i < sub_level; i++) {
                yield db_1.default.subLevel.create({
                    data: {
                        name: `SubLevel ${i + 1}`,
                        content: `Content for sublevel ${i + 1}`,
                        levelId: level.id,
                        order: i + 1,
                    },
                });
            }
        }
        const allSubLevels = yield db_1.default.subLevel.findMany({
            where: { levelId: levelProgress.levelId },
            orderBy: { order: 'asc' },
        });
        // Create or update SubLevelProgress records for all relevant sub-levels
        for (let i = 0; i < sub_level; i++) {
            const sublevel = allSubLevels[i];
            const subLevelProgress = yield db_1.default.subLevelProgress.findMany({
                where: {
                    levelProgressId: levelProgress.id,
                    subLevelId: sublevel.id,
                },
            });
            if (!subLevelProgress) {
                yield db_1.default.subLevelProgress.create({
                    data: {
                        levelProgressId: levelProgress.id,
                        subLevelId: sublevel.id,
                        completed: false,
                        scoreAzure: 0.0,
                        completenessAzure: 0.0,
                        pronunciationAzure: 0.0,
                        fluencyAzure: 0.0,
                        passCountAzure: 0.0,
                        failCountAzure: 0.0,
                        accuracyAzure: 0.0,
                        attemptsAzure: 0.0,
                        langaugeModelID: langaugeModelID1
                    },
                });
                yield db_1.default.subLevelProgress.create({
                    data: {
                        levelProgressId: levelProgress.id,
                        subLevelId: sublevel.id,
                        completed: false,
                        scoreAzure: 0.0,
                        completenessAzure: 0.0,
                        pronunciationAzure: 0.0,
                        fluencyAzure: 0.0,
                        passCountAzure: 0.0,
                        failCountAzure: 0.0,
                        accuracyAzure: 0.0,
                        attemptsAzure: 0.0,
                        langaugeModelID: langaugeModelID2
                    },
                });
            }
        }
        res.status(200).json({ message: 'Level attempt processed successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while attempting the new level.' });
    }
});
exports.levelAttempt = levelAttempt;
