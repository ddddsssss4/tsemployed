import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();



const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendEmail(email:string , subject:string , message:string ):Promise<void>{ {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  }
  
  try{
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
  }catch(error){
     console.error(`Error sending email to ${email}: ${error}`);
     throw error;
  }
  };
}


//Function for sending the otp for the users

export async function sendOTP(email:string , otp:string ) {
  const subject = "Your OTP code is here";
  const message = `Your OTP code is ${otp}`;
  await sendEmail(email, subject ,message);
}