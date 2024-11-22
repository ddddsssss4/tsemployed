"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FormController_1 = require("../controllers/FormController");
const FormController_2 = require("../controllers/FormController");
const router = express_1.default.Router();
//@ts-ignore
router.post('/student-form', FormController_1.submitStudentDetails);
//@ts-ignore
router.get('/student-form/:studentId', FormController_2.getStudentDetails);
exports.default = router;
