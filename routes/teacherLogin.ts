import express from 'express'
import {teacherLogin} from '../controllers/teacherAuthController';
import {teacherSignup} from '../controllers/teacherAuthController';
const router = express.Router();
//@ts-ignore
router.post('/auth/login',teacherLogin);
//@ts-ignore
router.post('/auth/signup',teacherSignup);
export default router