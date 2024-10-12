import express from 'express'

import { levelAttempt } from '../controllers/LevelAttempt';
const router=express.Router();
//@ts-ignore
router.post("/attempt/new-level",levelAttempt)







export default router;