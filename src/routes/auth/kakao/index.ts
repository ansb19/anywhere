import { Router } from 'express';
import UserController from '../../../controllers/UserController';
import { KakaoAuthService } from '../../../services/auth/KakaoAuthService';
import KakaoAuthController from '../../../controllers/KakaoAuthController';

//상위 라우터로써  라우터인 '/auth/kakao/.'

const router = Router();

const kakaoAuthService = new KakaoAuthService();
const kakaoAuthController = new KakaoAuthController(kakaoAuthService);

// 프론트 로그인 버튼 클릭->  API를 호출하여 로그인 URL 호출
router.get('/url', kakaoAuthController.getKakaoAuthURL)
router.get('/callback', kakaoAuthController.kakaoCallback)

export default router;