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
exports.getData = void 0;
const db_1 = __importDefault(require("../lib/db"));
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield db_1.default.student.findMany({
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
                currentLevel.subLevelProgress.forEach(subLevelProgress => {
                    totalPassCount += subLevelProgress.passCount;
                    totalFailCount += subLevelProgress.failCount;
                });
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
exports.getData = getData;
