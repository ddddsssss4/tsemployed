"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentController_1 = require("../controllers/StudentController");
const router = express_1.default.Router();
//@ts-ignore
router.post('/signup', StudentController_1.signUp);
router.get('/allstudents', StudentController_1.getAllStudents);
// router.post('/createstudentLevel',createLevel);
// router.put('/updatestudent',scoreCreate);
exports.default = router;
