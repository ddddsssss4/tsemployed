import express  from 'express'

import { submitStudentDetails } from '../controllers/FormController';
import {getStudentDetails} from '../controllers/FormController'
import { findUser } from '../controllers/getSpecificControllers';
const router = express.Router();
//@ts-ignore
router.post('/student-form',submitStudentDetails)
//@ts-ignore
router.get('/student-form/:studentId',getStudentDetails);
//@ts-ignore
router.get('/finduser/:userId',findUser)
export default router