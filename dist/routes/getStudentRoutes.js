"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getStudentController_1 = require("../controllers/getStudentController");
const router = express_1.default.Router();
router.get('/student/data/:teacherId', (req, res) => {
    (0, getStudentController_1.getCardData)(req, res);
});
//@ts-ignore
router.get('/student/cardDetails/:studentId', (req, res) => {
    (0, getStudentController_1.cardDetails)(req, res);
});
exports.default = router;
