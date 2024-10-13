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
exports.teacherSignup = exports.teacherLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../lib/db")); // Ensure the path is correct for your project
// Teacher Login
const teacherLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const a = console.log(req.body);
    console.log(a);
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required", a });
    }
    try {
        // Fetch the teacher using email
        const teacher = yield db_1.default.teacher.findUnique({
            where: { email },
        });
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        // Verify the password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." });
        }
        // Login successful, return the teacher info
        return res.status(200).json({ message: "Login successful", teacher });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.teacherLogin = teacherLogin;
// Teacher Signup
const teacherSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, teacherId } = req.body;
    // Check if all required fields are provided
    if (!email || !password || !name || !teacherId) {
        return res.status(400).json({ error: "Email, password, name, and teacherId are required for signup." });
    }
    try {
        // Check if the teacher already exists
        const existingTeacher = yield db_1.default.teacher.findUnique({
            where: { email },
        });
        if (existingTeacher) {
            return res.status(409).json({ error: "Teacher with this email already exists." });
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new teacher
        const newTeacher = yield db_1.default.teacher.create({
            data: {
                name,
                email,
                password: hashedPassword,
                uniqueId: teacherId,
            },
        });
        // Registration successful, return the new teacher info
        return res.status(201).json({ message: "Teacher registered successfully", newTeacher });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred during signup." });
    }
});
exports.teacherSignup = teacherSignup;
