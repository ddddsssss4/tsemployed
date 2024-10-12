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
exports.specificStudentData = void 0;
const db_1 = __importDefault(require("../lib/db"));
const specificStudentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = parseInt(req.params.id);
        // Fetch the student details using the studentId
        const student = yield db_1.default.student.findUnique({
            where: { id: studentId },
            select: { name: true }, // Select only the student's name
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
            progress.subLevelProgress.forEach((subLevel) => {
                levelPassCount += subLevel.passCount; // Add to pass count
                levelFailCount += subLevel.failCount; // Add to fail count
            });
            return {
                levelId,
                passCount: levelPassCount,
                failCount: levelFailCount,
            };
        });
        // Return the student's name along with pass and fail counts for each level
        return res.status(200).json({
            studentName: student.name,
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
exports.specificStudentData = specificStudentData;
