import express from 'express'
import {  getAllStudents , signUp } from '../controllers/StudentController';

const router =express.Router();
//@ts-ignore
router.post('/signup',signUp);
router.get('/allstudents',getAllStudents);
router.post('/login')
// router.post('/createstudentLevel',createLevel);
// router.put('/updatestudent',scoreCreate);


export default router;