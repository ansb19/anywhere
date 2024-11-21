import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// 사용자가 처음이면 회원가입 기존에 있으면 로그인
router.get('/sign', UserController.createUser);

// 닉네임을 변경
router.put('/update/nickname', UserController.updateUser);

router.get('/find/nickname',UserController.getUserByNickname);

router.delete('/delete/nickname',UserController.deleteUser);



// 유저의 등록한 장소 조회
router.get('/place/find',);

// 유저의 등록한 장소 삭제
router.delete('/place/delete',);

// 유저의 등록한 장소 수정
router.put('/place/update',);

export default router;