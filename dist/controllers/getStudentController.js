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
exports.cardDetails = exports.getCardData = void 0;
const db_1 = __importDefault(require("../lib/db"));
//from this end-point you will get the basic information about the students . This all information is for the card we are creating as soon as the teacher is entering the
//homepage
const getCardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = req.params.teacherId;
    console.log(teacherId);
    try {
        const teacher = yield db_1.default.teacher.findUnique({
            where: {
                id: teacherId,
            },
            select: {
                uniqueId: true,
            },
        });
        console.log(teacher);
        const students = yield db_1.default.student.findMany({
            where: {
                teacher: {
                    uniqueId: teacher === null || teacher === void 0 ? void 0 : teacher.uniqueId
                }
            },
            include: {
                levelProgress: {
                    include: {
                        level: true,
                        subLevelProgress: {
                            include: {
                                subLevel: true,
                            },
                        },
                    },
                },
            },
        });
        const studentsWithAccuracyAndHighestLevel = students.map(student => {
            let totalPassCount = 0;
            let totalFailCount = 0;
            const highestLevel = student.levelProgress.reduce((maxLevel, currentLevel) => {
                const currentLevelNumber = currentLevel.level.levelNumber;
                // Calculate pass and fail counts for accuracy
                for (const subLevelProgress of currentLevel.subLevelProgress) {
                    totalPassCount += subLevelProgress.passCount;
                    totalFailCount += subLevelProgress.failCount;
                }
                return currentLevelNumber > maxLevel ? currentLevelNumber : maxLevel;
            }, 0); // Initial max level is set to 0
            const totalAttempts = totalPassCount + totalFailCount;
            const accuracy = totalAttempts > 0 ? (totalPassCount / totalAttempts) * 100 : 0;
            return {
                id: student.id,
                name: student.name,
                accuracy: accuracy.toFixed(2), // Keeping the accuracy up to 2 decimal places
                highestLevel,
            };
        });
        res.status(200).json(studentsWithAccuracyAndHighestLevel);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});
exports.getCardData = getCardData;
//This is about as soon as you enter the card you will get all that inforamtion in here
const cardDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = Number.parseInt(req.params.studentId);
        // Fetch the student details using the studentId
        const student = yield db_1.default.student.findUnique({
            where: { id: studentId },
            select: { name: true, email: true }, // Select only the student's name
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        // Fetch all levels and their sub-level progress for the given student ID
        const levelProgress = yield db_1.default.levelProgress.findMany({
            where: { studentId },
            include: {
                level: {
                    include: {
                        subLevels: true, // Include sub-levels in the level data
                    },
                },
                subLevelProgress: true,
            },
        });
        // Prepare an object to hold pass and fail counts for each level
        const levelsWithCounts = levelProgress.map((progress) => {
            const levelId = progress.level.id;
            let levelPassCount = 0;
            let levelFailCount = 0;
            // Calculate pass and fail counts for the current level's sub-levels
            // Calculate pass and fail counts for the current level's sub-levels
            for (const subLevel of progress.subLevelProgress) {
                levelPassCount += subLevel.passCount; // Add to pass count
                levelFailCount += subLevel.failCount; // Add to fail count
            }
            return {
                levelId,
                passCount: levelPassCount,
                failCount: levelFailCount,
            };
        });
        // Return the student's name along with pass and fail counts for each level
        return res.status(200).json({
            studentName: student.name,
            studentEmail: student.email,
            levelsWithCounts: levelsWithCounts.map(level => ({
                levelId: level.levelId,
                passCount: level.passCount,
                failCount: level.failCount,
            })),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.cardDetails = cardDetails;
