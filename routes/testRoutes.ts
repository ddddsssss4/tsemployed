import express from 'express'
import { testAttemptAzure } from '../controllers/TestAttempt';
import { testAttemptCustom } from '../controllers/TestAttempt';
const router=express.Router();

//@ts-ignore
router.post('/test-attempt/azure',testAttemptAzure);
//@ts-ignore
router.post('/test-attempt/custom',testAttemptCustom);
export default router