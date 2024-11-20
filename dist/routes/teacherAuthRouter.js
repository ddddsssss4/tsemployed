"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherAuthController_1 = require("../controllers/teacherAuthController");
const router = express_1.default.Router();
// Define routes with appropriate method and path
router.post('/auth/login', (req, res) => {
    (0, teacherAuthController_1.teacherLogin)(req, res);
});
router.post('/auth/signup', (req, res) => {
    (0, teacherAuthController_1.teacherSignup)(req, res);
});
router.patch('/auth/changePassword', (req, res) => {
    (0, teacherAuthController_1.changePassword)(req, res);
});
exports.default = router;
