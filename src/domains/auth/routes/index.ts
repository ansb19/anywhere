import { Router } from "express";
import kakaoRoutes from './kakao';
import Container from "typedi";
import { AuthController } from "../controllers/auth.controller";

//상위 라우터로써  라우터인 '/auth/'
const router = Router();


router.use('/kakao', kakaoRoutes);
//router.use('/google',);

const authController = Container.get(AuthController);
router.post('/email', authController.sendEmailAuth);
router.post('/sms', authController.sendSMSAuth);
router.post('/verification', authController.verifyCode);
export default router;