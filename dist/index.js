"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
// Create an Express app
const app = (0, express_1.default)();
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Simple route
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
// Another route
app.get('/api/greet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.default.user.findMany();
    res.json({ users });
}));
app.get('/api/users', (req, res) => {
    res.json({ message: 'Hello from users!' });
});
app.post('/api/checkdb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const user = yield db_1.default.user.create({
        data: { name }
    });
    res.json(user);
}));
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
