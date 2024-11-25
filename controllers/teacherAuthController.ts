import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../lib/db"; // Ensure the path is correct for your project
import jwt, { verify } from 'jsonwebtoken'
// Teacher Login
export const teacherLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body)

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json(
      { error: "Email and password are required" }
    
    ) ;
  }

  try {
    // Fetch the teacher using email
    const teacher = await db.teacher.findUnique({
      where: { email },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }
    const token = jwt.sign(teacher.id, "secretOrPrivateKey") 
    // Login successful, return the teacher info
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
};

// Teacher Signup
export const teacherSignup = async (req: Request, res: Response) => {
  const { email, password, name, teacherId } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !name || !teacherId) {
    return res.status(400).json({ error: "Email, password, name, and teacherId are required for signup." });
  }

  try {
    // Check if the teacher already exists
    const existingTeacher = await db.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return res.status(409).json({ error: "Teacher with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = await db.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        uniqueId: teacherId,
      },
    });

    // Generate JWT token, including the teacher's id in the payload
    const token = jwt.sign({ id: newTeacher.id }, "secretOrPrivateKey", { expiresIn: "1h" });

    // Registration successful, return the new teacher info
    return res.status(201).json({
      message: "Teacher registered successfully",
      teacher: newTeacher,
      token,
       
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during signup." });
  }
};


export const changePassword = async (req:Request,res:Response) =>{
  try{
    const {email,newPassword,currentPassword} = req.body
    
    console.log(req.body)
    
    if(!email || !newPassword || !currentPassword){
      return res.status(400).json({message:'email ,currentPassword ,newPassword field should be there'})
    }
    
    const user = await db.teacher.findUnique({
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
    await db.teacher.update({
      where:{email:email},
      data:{password:hashedPassword}
    })
    
    return res.status(200).json({ message:"Password changed succesfully"})
    
  }catch(error){
    console.error("Error changing password", error);
    return res.status(500).json({message:"Internal server error"})
  }
}

export const deleteUser = async (req:Request,res:Response) =>{
  const { userId } = req.params;
  const token = req.headers['authorization']
  
  try{
   //@ts-ignore 
    const payload = jwt.verify(token, "secretOrPrivateKey");
    
    //@ts-ignore 
    if(payload!==userId){
      res.status(403).json({message:"You are not authorized to delete the user "})
    }
    const user = db.teacher.findUnique({
      where:{id:userId}
    })
    if(!user){
      res.status(404).json({ message: "User not found" });
    }
    
    await db.teacher.delete({
      where:{id:userId}
    })
    
    
    
    
  }catch(error){}
}