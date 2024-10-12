import express, { Request, Response } from 'express';

// Create an Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Another route
app.get('/api/greet', (req: Request, res: Response) => {
  res.json({ message: 'Hello from API!' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
