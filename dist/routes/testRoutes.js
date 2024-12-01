"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TestAttempt_1 = require("../controllers/TestAttempt");
const TestAttempt_2 = require("../controllers/TestAttempt");
const router = express_1.default.Router();
//@ts-ignore
router.post('/test-attempt/azure', TestAttempt_1.testAttemptAzure);
//@ts-ignore
router.post('/test-attempt/custom', TestAttempt_2.testAttemptCustom);
exports.default = router;
