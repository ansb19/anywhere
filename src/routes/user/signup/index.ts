import { Router } from 'express';
import UserSignupController from '../../../controllers/user-signup.controller';
import UserSignupService from '../../../services/user/user-signup.service';
import { UserService } from '../../../services/user/user.service';
import { SocialUserService } from '../../../services/user/social-user.service';
import { EmailAuthService } from '../../../services/auth/email-auth.service';
import { SMSAuthService } from '../../../services/auth/sms-auth.service';
import { PasswordService } from '../../../services/auth/password.service';
import { KakaoService } from '../../../services/auth/kakao-auth.service';


//하위 라우터로써  라우터인 '/user/signup'
const router = Router();

// 필요한 서비스들을 인스턴스화
const userService = new UserService();
const socialUserService = new SocialUserService();
const emailAuthService = new EmailAuthService();
const smsAuthService = new SMSAuthService();
const passwordService = new PasswordService();
const kakaoService = new KakaoService();

const userSignupService = new UserSignupService(
    userService, socialUserService, emailAuthService,
    smsAuthService, passwordService, kakaoService);

const userSignupController = new UserSignupController(userSignupService);


router.post('/', userSignupController.signup);
router.get('/kakao', userSignupController.signupKakaoUser);
router.post('/vertification/sms', userSignupController.sendCertSMS);
router.post('/vertification/email', userSignupController.sendCertEmail);
router.post('/check_duplicate', userSignupController.checkDuplicate);

export default router;