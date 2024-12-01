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
const express_1 = __importDefault(require("express"));
const otpService_1 = require("../lib/otpService");
const emailService_1 = require("../lib/emailService");
const router = express_1.default.Router();
const axios_1 = __importDefault(require("axios"));
// Endpoint to send OTP
let tempStudent = null;
let tempTeacher = null;
let tem;
router.post('/student/send-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, teacherId, password, name } = req.body;
    console.log(email);
    try {
        // Generate OTP
        tempStudent = { email, teacherId, password, name };
        console.log(tempStudent);
        const otp = yield (0, otpService_1.generateOtp)();
        // Store OTP in Redis
        yield (0, otpService_1.storeOtp)(email, otp);
        // Send OTP via email
        yield (0, emailService_1.sendOTP)(email, otp);
        res.status(200).json({ message: 'OTP sent to email!' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
}));
// Endpoint to verify OTP
router.post('/verify-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = req.body;
    try {
        // Verify OTP
        const isValid = yield (0, otpService_1.verifyOtp)(email, otp);
        console.log(tempStudent);
        if (isValid.valid) {
            try {
                console.log(tempStudent);
                // Call another route and pass some body
                const response = yield axios_1.default.post('https://speechbk-asghe5g9d2fsfydr.eastus2-01.azurewebsites.net/api/v1/student/auth/signup', tempStudent);
                res.status(200).json({
                    message: 'OTP verified successfully!',
                    anotherRouteResponse: response.data, // Include the response from the other route
                });
            }
            catch (error) {
                res.status(500).json({
                    message: 'OTP verified, but error occurred in another route.',
                    error: error
                });
            }
        }
        else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
}));
router.post('/teacher/send-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, teacherId, password, name } = req.body;
    console.log(email);
    try {
        // Generate OTP
        tempTeacher = { email, teacherId, password, name };
        console.log(tempTeacher);
        const otp = yield (0, otpService_1.generateOtp)();
        // Store OTP in Redis
        yield (0, otpService_1.storeOtp)(email, otp);
        // Send OTP via email
        yield (0, emailService_1.sendOTP)(email, otp);
        res.status(200).json({ message: 'OTP sent to email!' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
}));
router.post('/teacher/verify-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = req.body;
    try {
        // Verify OTP
        const isValid = yield (0, otpService_1.verifyOtp)(email, otp);
        console.log(tempTeacher);
        if (isValid.valid) {
            try {
                console.log(tempStudent);
                // Call another route and pass some body
                const response = yield axios_1.default.post('https://speechbk-asghe5g9d2fsfydr.eastus2-01.azurewebsites.net/api/v1/teacher/auth/signup', tempTeacher);
                console.log("Response", response.data);
                console.log("Hogya bhai");
                res.status(200).json({
                    message: 'OTP verified successfully!',
                    anotherRouteResponse: response.data, // Include the response from the other route
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'OTP verified, but error occurred in another route.',
                    error: error
                });
            }
        }
        else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
}));
exports.default = router;
