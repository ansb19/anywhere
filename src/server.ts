import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config(); // dotenv 설정값 불러오는 함수

const app = express(); // express 프레임워크 설정
const port = process.env.PORT; // env 포트 설정

const cors_option = {
    origin: process.env.FRONT_END_API,
    // 통신형식 default 값 사용( 전부 허용)
    credentials: true // 외부 통신 허용
};

app.use(cors(cors_option)); // 외부 통신 cors 허용
app.use(express.json()); // json 요청 본문을 파싱
//app.use('/router,' mapRouter); rest api 라우터 설정

app.listen(port, () => {
    console.log(`서버 구동 중.. port:${port}`);
})