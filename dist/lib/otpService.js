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
exports.generateOtp = generateOtp;
exports.storeOtp = storeOtp;
exports.verifyOtp = verifyOtp;
const crypto_1 = __importDefault(require("crypto"));
const otpStorage = new Map(); // In-memory storage for OTPs (replace with Redis later)
const OTP_EXPIRY_TIME = 5 * 60 * 1000;
var user_email = '';
function generateOtp() {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate a random 6-digit OTP
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        return otp;
    });
}
function storeOtp(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        email = email.trim().toLowerCase(); // Normalize email
        otpStorage.set(email, {
            otp,
            expiry: Date.now() + OTP_EXPIRY_TIME,
        });
        console.log('OTP stored:', email, otpStorage.get(email));
    });
}
function verifyOtp(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        email = email.trim().toLowerCase(); // Normalize email
        console.log('Email to verify:', email);
        console.log('Stored OTP Map:', Array.from(otpStorage.entries()));
        const stored = otpStorage.get(email);
        console.log('Stored OTP for email:', stored);
        if (!stored) {
            return { valid: false, message: 'OTP not found or expired.' };
        }
        if (Date.now() > stored.expiry) {
            otpStorage.delete(email);
            return { valid: false, message: 'OTP has expired.' };
        }
        if (stored.otp === otp) {
            otpStorage.delete(email);
            return { valid: true, message: 'OTP verified successfully.' };
        }
        return { valid: false, message: 'Invalid OTP.' };
    });
}
