import { Router } from 'express';
import Container from 'typedi';
import { UserLoginController } from '../../controllers/user-login.controller';





//하위 라우터로써  라우터인 '/user/login'
const router = Router();

// 필요한 서비스들을 인스턴스화

const userLoginController = Container.get(UserLoginController);


router.post('/anywhere', userLoginController.login_anywhere);

router.post('/social', userLoginController.login_social);


export default router;