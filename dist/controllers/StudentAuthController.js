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
exports.changePassword = exports.deleteUser = exports.login = exports.signUp = exports.getAllStudents = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../lib/db")); // Ensure this points to your database configuration
const zod = __importStar(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Zod schema to validate student and level data
const createLevelSchema = zod.object({
    studentId: zod.number().nonnegative(),
    levelId: zod.number().nonnegative().optional(),
});
// Function to get all students
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield db_1.default.student.findMany();
    res.json(students);
});
exports.getAllStudents = getAllStudents;
// Function for student signup
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, teacherId } = req.body;
    // Check if a user with this email already exists
    const existingUser = yield db_1.default.student.findFirst({
        where: { email }
    });
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
    }
    try {
        // Hash the password before saving it
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new student
        const user = yield db_1.default.student.create({
            data: { email, password: hashedPassword, teacherId }
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
        const payload = user.id.toString();
        const token = jsonwebtoken_1.default.sign(payload, "secretOrPrivateKey");
        // Create LevelProgress for the user for Level 1
        // (This part will depend on your schema for LevelProgress)
        return res.status(201).json({
            message: 'Student created successfully with level progress.',
            student: user,
            token: token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the student.' });
    }
});
exports.signUp = signUp;
// Function for student login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if the email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        // Find the student by email
        const student = yield db_1.default.student.findUnique({
            where: { email }
        });
        if (!student) {
            return res.status(404).json({ error: "User not found." });
        }
        // Compare the password with the stored hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." });
        }
        const payload = student.id.toString();
        // Generate a JWT token upon successful login
        const token = jsonwebtoken_1.default.sign(payload, "secretOrPublicKey");
        // Respond with the token and student data
        return res.status(200).json({
            message: "Login successful",
            student: {
                id: student.id,
                email: student.email,
                teacherId: student.teacherId
            },
            token: token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.login = login;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log(typeof (userId));
    console.log(userId);
    //@ts-ignore
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    try {
        //verifying the token belongs to the same userId
        //@ts-ignore
        const decoded = jsonwebtoken_1.default.verify(authHeader, "secretOrPublicKey");
        console.log(decoded);
        console.log(typeof (decoded));
        //@ts-ignore
        if (decoded !== (userId)) {
            return res.status(404).json({ message: 'Unauthorized: Token does not match user ID' });
        }
        const user = db_1.default.student.findUnique({
            where: { id: Number.parseInt(userId) },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found " });
        }
        yield db_1.default.student.delete({
            where: { id: Number.parseInt(userId) }
        });
        res.status(200).json({ message: "Oh we re really sad ! Hope You will be back soon" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "bhai yeh toh issue aa gya", error });
    }
});
exports.deleteUser = deleteUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword, currentPassword } = req.body;
        console.log(1);
        if (!email || !newPassword || !currentPassword) {
            return res.status(400).json({ message: 'email ,currentPassword ,newPassword field should be there' });
        }
        const user = yield db_1.default.student.findUnique({
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
        yield db_1.default.student.update({
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
