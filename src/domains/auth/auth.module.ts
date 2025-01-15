import { Router } from "express";
import Container from "typedi";
import { AuthController } from "./controllers/auth.controller";
export class AuthModule {

    static init(): Router {
        const router = Router();

        //의존성
        const authController = Container.get(AuthController);

        router.post('/email', authController.sendEmailAuth);
        router.post('/sms', authController.sendSMSAuth);
        router.post('/code', authController.verifyCode);

        return router;
    }
}