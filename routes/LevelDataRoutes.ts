import express from "express"
import { LevelData } from "../controllers/LevelDataController";
const router = express.Router();
//@ts-ignore
router.get('/student/:studentId',LevelData);
export default router;