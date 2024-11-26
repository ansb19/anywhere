import { Router } from 'express';
import UserController from '../../../controllers/UserController';

//상위 라우터로써  라우터인 '/auth/kakao/.'

const router = Router();



// 프론트 로그인 버튼 클릭->  API를 호출하여 로그인 URL 호출
router.get('/url',  )
router.get('/callback',  )

export default router;