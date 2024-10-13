import express from 'express'
import cors from 'cors'
import db from './lib/db';
const app = express();
app.use(express.json());
app.use(cors());
import studentRoutes from './routes/studentRoutes'
import levelRoutes from './routes/levelRoutes'
import testRoutes from './routes/testRoutes';
import getStudentRoutes from './routes/getStudentRoutes'
import getSpecificStudent from './routes/gettSpecificStudents'
import LevelSpecific from './routes/LevelDataRoutes'
import FormRoute from './routes/FormRoutes'
const port=Number(process.env.PORT || 8081)
import teacherLogin from './routes/teacherLogin'



app.use('/api/v1/auth',studentRoutes);
app.use('/api/v1/student',studentRoutes);
app.use('/api/v1/level',levelRoutes);
app.use('/api/v1/test',testRoutes);
app.use('/api/v1/data',getStudentRoutes );
app.use('/api/v1/data/specific',getSpecificStudent);
app.use('/api/v1/data/c',LevelSpecific);
app.use('/api/v1',FormRoute);
app.use('/api/v1/teacher',teacherLogin)
app.get('/',(req,res)=>{
    res.json({
        message : "Hello World from Bun!!"
    })
})

app.get('/users',async (req,res)=>{
    const users=await db.student.count();
    res.json({
        count:users
    })
})

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})


