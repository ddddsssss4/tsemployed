import crypto from 'crypto';
import e from 'express';

const otpStorage = new Map();  // In-memory storage for OTPs (replace with Redis later)

const OTP_EXPIRY_TIME = 5 * 60 * 1000;  

var user_email : string = '';

async function generateOtp() {
  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}



async function storeOtp(email: string, otp: string) {
  email = email.trim().toLowerCase(); // Normalize email
  otpStorage.set(email, {
    otp,
    expiry: Date.now() + OTP_EXPIRY_TIME,
  });
  console.log('OTP stored:', email, otpStorage.get(email));
}

async function verifyOtp(email: string, otp: string) {
  email = email.trim().toLowerCase(); // Normalize email
  console.log('Email to verify:', email);
  console.log('Stored OTP Map:', Array.from(otpStorage.entries()));

  const stored = otpStorage.get(email);
  console.log('Stored OTP for email:', stored);

  if (!stored) {
    return { valid: false, message: 'OTP not found or expired.' };
  }

  if (Date.now() > stored.expiry) {
    otpStorage.delete(email);
    return { valid: false, message: 'OTP has expired.' };
  }

  if (stored.otp === otp) {
    otpStorage.delete(email);
    return { valid: true, message: 'OTP verified successfully.' };
  }

  return { valid: false, message: 'Invalid OTP.' };
}


export { generateOtp, storeOtp, verifyOtp };
