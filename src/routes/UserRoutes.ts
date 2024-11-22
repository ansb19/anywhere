import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

//user의 신상 정보
router.post('/sign_up', UserController.createUser); // 사용자 회원가입
router.post('/sign_in', UserController.createUser); // 사용자 로그인
//router.post('/sign_out', UserController.createUser); // 사용자 로그아웃
router.put('/update/nickname', UserController.updateUser); // 사용자 닉네임 변경
router.get('/find/nickname', UserController.getUserByNickname); // 닉네임을 통한 사용자 전체 정보 조회
router.delete('/delete/nickname', UserController.deleteUser); // 닉네임을 통한 사용자 탈퇴


//test용
router.get('/test', UserController.test);

export default router;