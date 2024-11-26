"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data_source");
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
dotenv_1.default.config(); // dotenv 설정값 불러오는 함수
const app = (0, express_1.default)(); // express 프레임워크 설정
const port = parseInt(process.env.PORT || '3000', 10); // env 포트 설정
// CORS 옵션 설정
const cors_option = {
    origin: true,
    //method: default가 전부 허용
    credentials: true // 외부 통신 허용
};
// 미들웨어 설정
app.use((0, cors_1.default)(cors_option)); // 외부 통신 cors 허용
app.use(express_1.default.json()); // json 요청 본문을 파싱
// 데이터베이스 초기화 및 서버 시작 함수 정의
async function startServer() {
    try {
        // 데이터베이스 연결 초기화
        await data_source_1.AppDataSource.initialize();
        console.log('Data Source is initialized!');
        // 라우트 설정 (예: 사용자 라우트 추가)
        app.use('/user', UserRoutes_1.default); // rest api 라우터 설정 (라우트 추가 시 활성화)
        // 서버 시작
        const server = app.listen(port, '0.0.0.0', () => {
            console.log(`서버 구동 중... port: ${port}`);
        });
        // 서버 종료 처리 (SIGTERM, SIGINT)
        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                // 데이터베이스 연결 닫기
                await data_source_1.AppDataSource.destroy();
                console.log('Database connection closed');
                process.exit(0);
            });
        });
        process.on('SIGINT', async () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                // 데이터베이스 연결 닫기
                await data_source_1.AppDataSource.destroy();
                console.log('Database connection closed');
                process.exit(0);
            });
        });
    }
    catch (err) {
        console.error('Data Source is not initialized: ', err);
        process.exit(1); // 에러 발생 시 프로세스 종료
    }
}
startServer();
