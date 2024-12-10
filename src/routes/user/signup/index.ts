import { Router } from 'express';
import UserSignupController from '../../../controllers/UserSignupController';
import UserSignupService from '../../../services/user/UserSignupService';
import { UserService } from '../../../services/user/UserService';
import { SocialUserService } from '../../../services/user/SocialUserService';
import { EmailAuthService } from '../../../services/auth/EmailAuthService';
import { SMSAuthService } from '../../../services/auth/SMSAuthService';
import { PasswordService } from '../../../services/auth/PasswordService';
import { KakaoService } from '../../../services/auth/KakaoService';


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