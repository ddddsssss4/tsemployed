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
exports.deleteUser = exports.changePassword = exports.teacherSignup = exports.teacherLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../lib/db")); // Ensure the path is correct for your project
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Teacher Login
const teacherLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
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
        const token = jsonwebtoken_1.default.sign(teacher.id, "secretOrPrivateKey");
        // Login successful, return the teacher info
        return res.status(200).json({ message: "Login successful", token });
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
        console.log(newTeacher);
        const token = jsonwebtoken_1.default.sign(newTeacher.id, "secretOrPrivateKey");
        console.log(token);
        // Registration successful, return the new teacher info
        return res.status(201).json({ message: "Teacher registered successfully", token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred during signup." });
    }
});
exports.teacherSignup = teacherSignup;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword, currentPassword } = req.body;
        console.log(req.body);
        if (!email || !newPassword || !currentPassword) {
            return res.status(400).json({ message: 'email ,currentPassword ,newPassword field should be there' });
        }
        const user = yield db_1.default.teacher.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User with this email is not found' });
        }
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: 'Current Password is incorrect' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield db_1.default.teacher.update({
            where: { email: email },
            data: { password: hashedPassword }
        });
        return res.status(200).json({ message: "Password changed succesfully" });
    }
    catch (error) {
        console.error("Error changing password", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.changePassword = changePassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const token = req.headers['authorization'];
    try {
        //@ts-ignore 
        const payload = jsonwebtoken_1.default.verify(token, "secretOrPrivateKey");
        //@ts-ignore 
        if (payload !== userId) {
            res.status(403).json({ message: "You are not authorized to delete the user " });
        }
        const user = db_1.default.teacher.findUnique({
            where: { id: userId }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        yield db_1.default.teacher.delete({
            where: { id: userId }
        });
    }
    catch (error) { }
});
exports.deleteUser = deleteUser;
