import express, { Request, Response, Router } from 'express';
import { teacherLogin, teacherSignup, changePassword } from '../controllers/teacherAuthController';

const router: Router = express.Router();

// Define routes with appropriate method and path
router.post('/auth/login', (req: Request, res: Response) => {
  teacherLogin(req, res);
});

router.post('/auth/signup', (req: Request, res: Response) => {
  teacherSignup(req, res);
});

router.patch('/auth/changePassword', (req: Request, res: Response) => {
  changePassword(req, res);
});

export default router;
