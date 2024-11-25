import { sendOTP } from "../lib/emailService";

export async function sendOTPController(req: any, res: any) {
  try {
    const { email, otp } = req.body;
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
}