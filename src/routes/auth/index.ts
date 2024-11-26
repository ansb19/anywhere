import { Router } from "express";
import kakaoRoutes from './kakao';

//상위 라우터로써  라우터인 '/auth/'
const router = Router();

router.use('/kakao', kakaoRoutes);

export default router;