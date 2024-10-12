"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Create an Express app
const app = (0, express_1.default)();
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Simple route
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
// Another route
app.get('/api/greet', (req, res) => {
    res.json({ message: 'Hello from API!' });
});
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
