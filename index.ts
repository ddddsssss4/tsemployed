import express, { Request, Response } from 'express';
import db from './db';

// Create an Express app
const app = express();


// Middleware to parse JSON requests
app.use(express.json());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Another route
app.get('/api/greet', async (req: Request, res: Response) => {
  const users= await db.user.findMany();
  res.json({ users });
});

app.get('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'Hello from users!' });
});


app.post('/api/checkdb',async (req,res)=>{
  const {name} =req.body;


  const user = await db.user.create({
    data: { name }
  });


  res.json(user);
})



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
