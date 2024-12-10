import { Router } from 'express';
import { KakaoService } from '../../../services/auth/KakaoService';
import KakaoController from '../../../controllers/KakaoController';

//하위 라우터로써  라우터인 '/auth/kakao/.'

const router = Router();

const kakaoService = new KakaoService();
const kakaoController = new KakaoController(kakaoService);

// 프론트 로그인 버튼 클릭->  API를 호출하여 로그인 URL 호출
router.get('/url', kakaoController.getKakaoAuthURL)
router.get('/callback', kakaoController.kakaoCallback)


export default router;