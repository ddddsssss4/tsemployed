import express from 'express';
import { generateOtp, storeOtp, verifyOtp } from '../lib/otpService';
import { sendOTP } from '../lib/emailService';
const router = express.Router();
import axios from 'axios';

// Endpoint to send OTP
let tempStudent: { email: string; teacherId: string; password: string; name: string } | null = null;
let tempTeacher: {email : string; teacherId : string; password : string ; name : string} | null = null
let tem
router.post('/student/send-otp', async (req, res) => {
    const { email , teacherId , password ,name } = req.body;
    console.log(email);

    try {
        // Generate OTP
        tempStudent = { email, teacherId, password , name };
        console.log(tempStudent);
        const otp =  await generateOtp();
        // Store OTP in Redis
        await storeOtp(email, otp);

        // Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

// Endpoint to verify OTP
router.post('/verify-otp', async (req, res) => {
    const { otp , email } = req.body;
      
    try {
        // Verify OTP
        const isValid = await verifyOtp(email, otp);
        console.log(tempStudent);
        if (isValid.valid) {
          try {
            console.log(tempStudent);
              // Call another route and pass some body
              const response = await axios.post('http://localhost:8081/api/v1/student/auth/signup', tempStudent);
  
              res.status(200).json({
                  message: 'OTP verified successfully!',
                  anotherRouteResponse: response.data, // Include the response from the other route
              });
          } catch (error) {
              res.status(500).json({
                  message: 'OTP verified, but error occurred in another route.',
                  error: error
              });
          }
      } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});



router.post('/teacher/send-otp', async (req, res) => {
    const { email , teacherId , password , name } = req.body;
    console.log(email);

    try {
        // Generate OTP
        tempTeacher = { email, teacherId, password ,name };
        console.log(tempTeacher);
        const otp =  await generateOtp();
        // Store OTP in Redis
        await storeOtp(email, otp);

        // Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});


router.post('/teacher/verify-otp', async (req, res) => {
    const { otp , email } = req.body;
      
    try {
        // Verify OTP
        const isValid = await verifyOtp(email, otp);
        console.log(tempTeacher);
        if (isValid.valid) {
          try {
            console.log(tempStudent);
              // Call another route and pass some body
              const response = await axios.post('http://localhost:8081/api/v1/teacher/auth/signup', tempTeacher);
  
              res.status(200).json({
                  message: 'OTP verified successfully!',
                  anotherRouteResponse: response.data, // Include the response from the other route
              });
          } catch (error) {
              res.status(500).json({
                  message: 'OTP verified, but error occurred in another route.',
                  error: error
              });
          }
      } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

export default router;
