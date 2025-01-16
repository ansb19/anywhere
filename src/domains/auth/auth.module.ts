import { Router } from "express";
import Container from "typedi";
import { AuthController } from "./controllers/auth.controller";
export class AuthModule {

    static init(): Router {
        const router = Router();

        //의존성
        const authController = Container.get(AuthController);

        //이메일 인증 전송
        router.post('/email', authController.sendEmailAuth);
        
        //휴대폰 인증 전송
        router.post('/sms', authController.sendSMSAuth);

        // 인증 코드 확인인
        router.post('/code', authController.verifyCode);

        return router;
    }
}