import express from 'express'
import { testAttempt } from '../controllers/TestAttempt';
const router=express.Router();

//@ts-ignore
router.post('/test-attempt/',testAttempt);
export default router