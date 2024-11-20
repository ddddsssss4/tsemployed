import express, { Request, Response, Router } from 'express';
import {  getAllStudents , signUp ,login} from '../controllers/StudentAuthController';
import { deleteUser } from '../controllers/StudentAuthController';
import { changePassword } from '../controllers/StudentAuthController';
const router:Router =express.Router();
//@ts-ignore
router.post('/auth/signup',(req:Request,res:Response) => {
  signUp(req, res);
});
router.get('/allstudents',(req:Request,res:Response) => {
  getAllStudents(req, res);
});
router.post('/auth/login', (req: Request, res: Response) => {
  login(req, res);
})

router.delete('/auth/deleteStudent/:userId',(req: Request, res: Response) => {
  deleteUser(req, res);
})

router.patch('/auth/changePassword',(req:Request,res:Response) => {
  changePassword(req,res)
})

export default router;