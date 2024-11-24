import express  from 'express'

import { submitStudentDetails } from '../controllers/FormController';
import {getStudentDetails} from '../controllers/FormController'

const router = express.Router();
//@ts-ignore
router.post('/student-form',submitStudentDetails)
//@ts-ignore
router.get('/student-form/:studentId',getStudentDetails);

export default router