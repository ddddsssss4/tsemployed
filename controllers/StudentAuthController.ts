import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../lib/db"; // Ensure this points to your database configuration
import * as zod from 'zod';
import jwt,{JwtPayload} from 'jsonwebtoken'
// Zod schema to validate student and level data
const createLevelSchema = zod.object({
  studentId: zod.number().nonnegative(),
  levelId: zod.number().nonnegative().optional(),
});



// Function to get all students
export const getAllStudents = async (req: Request, res: Response) => {
  const students = await db.student.findMany();
  res.json(students);
};

// Function for student signup
export const signUp = async (req: Request, res: Response) => {
  const { email, password, teacherId } = req.body;

  // Check if a user with this email already exists
  const existingUser = await db.student.findFirst({
    where: { email }
  });
   console.log(existingUser);

  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists." });
  } 
  
  
  try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new student
      const user = await db.student.create({
        data: { email, password: hashedPassword, teacherId }
      });

      // Ensure Level 1 exists and create it if not
      let level = await db.level.findFirst({
        where: { levelNumber: 1 } // Assuming level 1
      });

      if (!level) {
        level = await db.level.create({
          data: { levelNumber: 1 }
        });
      }
      
      const payload = user.id.toString();
      
      const token = jwt.sign(payload, "secretOrPrivateKey")

      // Create LevelProgress for the user for Level 1
      // (This part will depend on your schema for LevelProgress)

      return res.status(201).json({
        message: 'Student created successfully with level progress.',
        student: user,
        token:token
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while creating the student.' });
    }
  
};

// Function for student login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the student by email
    const student = await db.student.findUnique({
      where: { email }
    });

    if (!student) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }
    const payload = student.id.toString()
    // Generate a JWT token upon successful login
    const token = jwt.sign(payload,"secretOrPublicKey")

    // Respond with the token and student data
    return res.status(200).json({
      message: "Login successful",
     
      student: {
        id: student.id,
        email: student.email,
        teacherId: student.teacherId
      },
      token:token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
};

export const deleteUser = async (req:Request,res:Response) =>{
  const {userId} = req.params
  console.log(typeof (userId));
  console.log(userId);
  //@ts-ignore
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  
  
  try{
    //verifying the token belongs to the same userId
    //@ts-ignore
    const decoded = jwt.verify(authHeader, "secretOrPublicKey");
    console.log(decoded)
    console.log(typeof (decoded));
    //@ts-ignore
    if (decoded !== (userId)) {
          return res.status(404).json({ message: 'Unauthorized: Token does not match user ID' });
        }

    const user = db.student.findUnique({
      where:{id:Number.parseInt(userId)},
      
    })
    if(!user){
      return res.status(404).json({message:"User not found "})
    }
    
    await db.student.delete({
      where: {id:Number.parseInt(userId)}
    })
    
    res.status(200).json({message:"Oh we re really sad ! Hope You will be back soon"})
    
    
    
    
    
  }catch(error){
    console.error(error)
    res.status(500).json({message:"bhai yeh toh issue aa gya",error})
  }
  
}

export const changePassword = async (req:Request,res:Response) =>{
  try{
    const {email,newPassword,currentPassword} = req.body
    
    
    console.log(1);
    
    if(!email || !newPassword || !currentPassword){
      return res.status(400).json({message:'email ,currentPassword ,newPassword field should be there'})
    }
    
    const user = await db.student.findUnique({
      where:{email:email},
    })
    
    if(!user){
      return res.status(404).json({message:'User with this email is not found'})
    }
    const isMatch = await bcrypt.compare(currentPassword,user.password)
    if(!isMatch){
      return res.status(403).json({message:'Current Password is incorrect'})
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.student.update({
      where:{email:email},
      data:{password:hashedPassword}
    })
    
    return res.status(200).json({ message:"Password changed succesfully"})
    
  }catch(error){
    console.error("Error changing password", error);
    return res.status(500).json({message:"Internal server error"})
  }
}
