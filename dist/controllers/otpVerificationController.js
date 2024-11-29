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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPController = sendOTPController;
const emailService_1 = require("../lib/emailService");
function sendOTPController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, otp } = req.body;
            yield (0, emailService_1.sendOTP)(email, otp);
            res.status(200).json({ message: "OTP sent successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error sending OTP" });
        }
    });
}
