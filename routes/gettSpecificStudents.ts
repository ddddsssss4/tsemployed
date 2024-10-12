import express from "express"
import { specificStudentData } from "../controllers/getSpecificControllers";
const router = express.Router();
//@ts-ignore
router.get('/student/:id',specificStudentData);
export default router;