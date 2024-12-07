"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LevelDataController_1 = require("../controllers/LevelDataController");
const router = express_1.default.Router();
//@ts-ignore
router.get('/student/:studentId', LevelDataController_1.LevelData);
//@ts-ignore
//router.get('/custom/student/:studentId',levelDataCustom);
exports.default = router;
