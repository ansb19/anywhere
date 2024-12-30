import { Router } from 'express';

import UserSignupService from '../../services/user-signup.service';
import { UserService } from '../../services/user.service';
import { SocialUserService } from '../../services/social-user.service';
import Container from 'typedi';
import UserSignupController from '../../controllers/user-signup.controller';



//하위 라우터로써  라우터인 '/user/signup'
const router = Router();

// 필요한 서비스들을 인스턴스화




const userSignupController = Container.get(UserSignupController);


router.post('/', userSignupController.signup);
router.post('/kakao', userSignupController.signupKakaoUser);
router.get('/kakao/url', userSignupController.signupKaKaoUrl);
// router.post('/vertification/sms', userSignupController.sendCertSMS);
// router.post('/vertification/email', userSignupController.sendCertEmail);
router.post('/check_duplicate', userSignupController.checkDuplicate);

export default router;