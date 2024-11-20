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
exports.createAttempt = void 0;
const db_1 = __importDefault(require("../lib/db"));
const createAttempt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, levelId } = req.body;
    const { numberOfSubLevels } = req.body;
    // Ensure the level is unlocked
    const levelProgress = yield db_1.default.levelProgress.findFirst({
        where: { studentId, levelId, completed: false }
    });
    if (!levelProgress) {
        return res.status(400).json({ message: 'Level is not unlocked or already completed' });
    }
    // Fetch or create sub-level progress records based on the provided number of sublevels
    const existingSubLevelCount = yield db_1.default.subLevelProgress.count({
        where: { levelProgressId: levelProgress.id }
    });
    if (existingSubLevelCount < numberOfSubLevels) {
        const subLevels = Array.from({ length: numberOfSubLevels }, (_, index) => ({
            levelProgressId: levelProgress.id,
            subLevel: {
                create: {
                    name: `SubLevel ${index + 1}`,
                    description: `Description for SubLevel ${index + 1}`
                }
            }
        }));
    }
    res.json({ message: 'Level unlocked and sub-levels initialized' });
});
exports.createAttempt = createAttempt;
