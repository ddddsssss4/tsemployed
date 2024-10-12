"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.signUp = exports.getAllStudents = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../lib/db"));
const zod = __importStar(require("zod"));
const createLevelSchema = zod.object({
    studentId: zod.number().nonnegative(),
    levelId: zod.number().nonnegative().optional(),
});
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield db_1.default.student.findMany();
    res.json(students);
});
exports.getAllStudents = getAllStudents;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if a user with this email already exists
    const existingUser = yield db_1.default.student.findFirst({
        where: { email }
    });
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
    }
    else {
        try {
            // Hash the password before saving it
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // Create a new student
            const user = yield db_1.default.student.create({
                data: { email, password: hashedPassword }
            });
            // Ensure Level 1 exists and create it if not
            let level = yield db_1.default.level.findFirst({
                where: { levelNumber: 1 } // Assuming level 1
            });
            if (!level) {
                level = yield db_1.default.level.create({
                    data: { levelNumber: 1 }
                });
            }
            // Create LevelProgress for the user for Level 1
            return res.status(201).json({
                message: 'Student created successfully with level progress.',
                student: user
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while creating the student.' });
        }
    }
});
exports.signUp = signUp;
