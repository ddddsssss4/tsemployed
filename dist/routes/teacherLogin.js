"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherAuthController_1 = require("../controllers/teacherAuthController");
const teacherAuthController_2 = require("../controllers/teacherAuthController");
const router = express_1.default.Router();
//@ts-ignore
router.post('/auth/login', teacherAuthController_1.teacherLogin);
//@ts-ignore
router.post('/auth/signup', teacherAuthController_2.teacherSignup);
exports.default = router;
