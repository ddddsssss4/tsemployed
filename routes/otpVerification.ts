import express , {Request,Response} from 'express'
import { sendOTPController } from '../controllers/otpVerificationController'

const router = express.Router();
router.post('/sendOTP',sendOTPController);

export default router