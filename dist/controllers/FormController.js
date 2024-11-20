"use strict";
// src/controllers/studentDetailsController.ts
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
exports.getStudentDetails = exports.submitStudentDetails = void 0;
const db_1 = __importDefault(require("../lib/db"));
// POST route to submit student details
const submitStudentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, age, favoriteColor, grade, skillLevel, ethnicity, background } = req.body;
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required.' });
    }
    try {
        // Check if student exists
        const student = yield db_1.default.student.findUnique({
            where: { id: Number.parseInt(studentId) },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        // Create or update student details
        const studentDetail = yield db_1.default.studentDetail.upsert({
            where: { studentId: Number.parseInt(studentId) },
            update: {
                age,
                favoriteColor,
                grade,
                skillLevel,
                ethnicity,
                background,
            },
            create: {
                studentId: Number.parseInt(studentId),
                age,
                favoriteColor,
                grade,
                skillLevel,
                ethnicity,
                background,
            },
        });
        res.status(200).json({ message: 'Student details saved successfully.', studentDetail });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving student details.' });
    }
});
exports.submitStudentDetails = submitStudentDetails;
// GET route to retrieve student details
const getStudentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.query;
    console.log(studentId);
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required.' });
    }
    try {
        const studentDetail = yield db_1.default.studentDetail.findUnique({
            //@ts-ignore
            where: { studentId: Number.parseInt(studentId) },
        });
        if (!studentDetail) {
            return res.status(404).json({ error: 'Student details not found.' });
        }
        res.status(200).json({ studentDetail });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving student details.' });
    }
});
exports.getStudentDetails = getStudentDetails;
