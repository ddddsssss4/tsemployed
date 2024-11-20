"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentAuthController_1 = require("../controllers/StudentAuthController");
const StudentAuthController_2 = require("../controllers/StudentAuthController");
const StudentAuthController_3 = require("../controllers/StudentAuthController");
const router = express_1.default.Router();
//@ts-ignore
router.post('/auth/signup', (req, res) => {
    (0, StudentAuthController_1.signUp)(req, res);
});
router.get('/allstudents', (req, res) => {
    (0, StudentAuthController_1.getAllStudents)(req, res);
});
router.post('/auth/login', (req, res) => {
    (0, StudentAuthController_1.login)(req, res);
});
router.delete('/auth/deleteStudent/:userId', (req, res) => {
    (0, StudentAuthController_2.deleteUser)(req, res);
});
router.patch('/auth/changePassword', (req, res) => {
    (0, StudentAuthController_3.changePassword)(req, res);
});
exports.default = router;
