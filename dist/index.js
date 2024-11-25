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
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./lib/db"));
const studentAuthRoutes_1 = __importDefault(require("./routes/studentAuthRoutes"));
const levelRoutes_1 = __importDefault(require("./routes/levelRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const getStudentRoutes_1 = __importDefault(require("./routes/getStudentRoutes"));
const LevelDataRoutes_1 = __importDefault(require("./routes/LevelDataRoutes"));
const FormRoutes_1 = __importDefault(require("./routes/FormRoutes"));
const teacherAuthRouter_1 = __importDefault(require("./routes/teacherAuthRouter"));
const TeacherAndStudentOtp_1 = __importDefault(require("./routes/TeacherAndStudentOtp"));
const port = Number(process.env.PORT || 8081);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/student', studentAuthRoutes_1.default);
app.use('/api/v1/level', levelRoutes_1.default);
app.use('/api/v1/test', testRoutes_1.default);
app.use('/api/v1/data', getStudentRoutes_1.default);
// app.use('/api/v1/data/specific',getSpecificStudent);
app.use('/api/v1/level/data', LevelDataRoutes_1.default);
app.use('/api/v1/studentDetails', FormRoutes_1.default);
app.use('/api/v1/teacher', teacherAuthRouter_1.default);
app.use('/api/v1/signup', TeacherAndStudentOtp_1.default);
app.get('/', (req, res) => {
    res.json({
        message: "Hello World from Bun!!"
    });
});
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.default.student.count();
    res.json({
        count: users
    });
}));
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
