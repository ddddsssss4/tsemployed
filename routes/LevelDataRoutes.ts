import express from "express"
import { LevelData } from "../controllers/LevelDataController";
const router = express.Router();
//@ts-ignore
router.get('/student/:id/data',LevelData);
export default router;