import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';

import 'reflect-metadata';
import 'tsconfig-paths/register';

import { UserModule } from './domains/user/user.module';
import { ReviewModule } from './domains/review/review.module';
import { PlaceModule } from './domains/place/place.module';
import { FavoriteModule } from './domains/favorite/favorite.module';
import { AuthModule } from './domains/auth/auth.module';
import { Database } from './config/database/Database';
import Container from 'typedi';
import { EnvConfig } from './config/env-config';
import { globalErrorHandler } from './common/exceptions/error-handler';
import { NotFoundError } from './common/exceptions/app.errors';
import cron from 'node-cron';
import { RefreshTokenService } from './common/services/refresh_token.service';
import { loggerMiddleware } from './middleware/logger.midlleware';
import { logger } from './common/utils/logger';
import Redis from './common/services/redis.service';


const env_config = Container.get(EnvConfig);




const app = express(); // express 프레임워크 설정
const port: number = env_config.PORT; // env 포트 설정

// CORS 옵션 설정
const cors_option = {
    origin: true,
    //method: default가 전부 허용
    credentials: true // 외부 통신 허용
};

// 미들웨어 설정
app.use(cors(cors_option)); // 외부 통신 cors 허용
app.use(express.json()); // json 요청 본문을 파싱

// 데이터베이스 초기화 및 서버 시작 함수 정의
async function startServer() {
    try {
        logger.info('Initializing server...');
        const database = Container.get(Database);
        // 데이터베이스 연결 초기화
        await database.initialize();
        logger.info('Database connection initialized.');

        await database.runMigrations(); // 프로덕션 시 비활성화
        logger.info('Database migrations executed.');

        const redis = Container.get(Redis);
        await redis.initialize();

        app.use('/user', UserModule.init());
        app.use('/place', PlaceModule.init());
        app.use('/favorite', FavoriteModule.init());
        app.use('/review', ReviewModule.init());
        app.use('/auth', AuthModule.init());

        app.get('/', (req, res) => {
            const currentTime = new Date();
            logger.info(`Current server time: ${currentTime}, 백엔드 접속`);
            res.send(`Welcome to the backend! time: ${currentTime}`);
        })

        app.use((req: Request, res: Response, next: NextFunction) => {
            logger.warn(`Invalid route accessed: ${req.originalUrl}`);
            const error = new NotFoundError("요청한 경로를 찾을 수 없습니다");
            next(error);
        }); //잘못된 라우터 요청시 응답

        app.use(globalErrorHandler);// 전역 에러 처리

        // 로깅 미들웨어 적용
        app.use(loggerMiddleware);

        // 서버 시작
        const server = app.listen(port, '0.0.0.0', () => {
            logger.info(`Server is running on port: ${port}`);
        });

        // 서버 종료 처리 (SIGTERM, SIGINT)
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM signal received: closing HTTP server...');
            server.close(async () => {
                logger.info('HTTP server closed.');
                // 데이터베이스 연결 닫기
                await database.close();
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            logger.info('SIGINT signal received: closing HTTP server...');
            server.close(async () => {
                logger.info('HTTP server closed.');
                // 데이터베이스 연결 닫기
                await database.close();
                process.exit(0);
            });
        });

    } catch (err) {
        logger.error('Error during server initialization', err);
        process.exit(1); // 에러 발생 시 프로세스 종료
    }
}

startServer();

cron.schedule('0 0 * * *', async () => {
    logger.info('Starting token refresh job...');
    const refresh = Container.get(RefreshTokenService);
    await refresh.auto_refresh_token();
    logger.info('Token refresh job completed.');
})