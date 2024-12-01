import express from "express"
import { LevelData , levelDataCustom } from "../controllers/LevelDataController";
const router = express.Router();
//@ts-ignore
router.get('/student/:studentId',LevelData);
//@ts-ignore
router.get('/custom/student/:studentId',levelDataCustom);
export default router;