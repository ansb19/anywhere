
import { Router } from 'express';
import KakaoController from '../../controllers/kakao.controller';

import Container from 'typedi';

//하위 라우터로써  라우터인 '/auth/kakao/.'

const router = Router();

// const envconfig = new EnvConfig();
// const kakaoClient = new KakaoClient(envconfig);
// const kakaoController = new KakaoController(kakaoClient);
// 이거 안해도 됨

const kakaoController = Container.get(KakaoController);

// 프론트 로그인 버튼 클릭->  API를 호출하여 로그인 URL 호출
router.get('/url', kakaoController.getKakaoAuthURL)
router.get('/callback', kakaoController.kakaoCallback)
router.get('/logout', )
router.get('/home',)

export default router;