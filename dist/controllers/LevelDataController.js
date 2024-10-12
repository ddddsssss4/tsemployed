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
exports.LevelData = void 0;
const db_1 = __importDefault(require("../lib/db"));
const LevelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = parseInt(req.params.id);
        const resultFilter = req.query.result; // Get the result query parameter
        // Fetch the student data with their sub-level progress
        const student = yield db_1.default.student.findUnique({
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
        let totalAccuracy = 0;
        let totalPronunciation = 0;
        let totalFluency = 0;
        let subLevelCount = 0;
        // Iterate over levelProgress and subLevelProgress
        student.levelProgress.forEach(levelProgress => {
            levelProgress.subLevelProgress.forEach(subLevelProgress => {
                // Filter based on the result query parameter
                const passed = subLevelProgress.passCount > 0;
                const failed = subLevelProgress.failCount > 0;
                if ((resultFilter === 'pass' && passed) ||
                    (resultFilter === 'fail' && failed) ||
                    !resultFilter // If no filter is provided, include all
                ) {
                    // @ts-ignore 
                    totalAccuracy += (subLevelProgress.accuracy);
                    // @ts-ignore 
                    totalPronunciation += subLevelProgress.pronunciation;
                    // @ts-ignore
                    totalFluency += subLevelProgress.fluency;
                    subLevelCount++;
                }
            });
        });
        // Calculate the averages
        const averageAccuracy = subLevelCount > 0 ? (totalAccuracy / subLevelCount).toFixed(2) : 0;
        const averagePronunciation = subLevelCount > 0 ? (totalPronunciation / subLevelCount).toFixed(2) : 0;
        const averageFluency = subLevelCount > 0 ? (totalFluency / subLevelCount).toFixed(2) : 0;
        console.log(student.id);
        console.log(student.name);
        console.log(averageAccuracy);
        console.log(averageFluency);
        console.log(averagePronunciation);
        // Return the averages
        res.status(200).json({
            studentId: student.id,
            name: student.name,
            averageAccuracy: averageAccuracy,
            averagePronunciation: averagePronunciation,
            averageFluency: averageFluency,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch student data' });
    }
});
exports.LevelData = LevelData;
