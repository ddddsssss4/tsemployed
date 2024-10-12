"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getSpecificControllers_1 = require("../controllers/getSpecificControllers");
const router = express_1.default.Router();
//@ts-ignore
router.get('/student/:id', getSpecificControllers_1.specificStudentData);
exports.default = router;
