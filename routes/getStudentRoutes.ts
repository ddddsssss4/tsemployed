import  express from 'express'

import { getData } from '../controllers/getStudentController';
const router = express.Router();

  router.get('/student',getData)
export default router