import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// 사용자가 처음이면 회원가입 기존에 있으면 로그인
router.post('/user/sign',UserController.createUser);

// 닉네임을 변경
router.get('/user/update/nickname',UserController.updateUser);

// 유저의 등록한 장소 조회
router.get('/user/place/find',);

// 유저의 등록한 장소 삭제
router.delete('/user/place/delete',);

// 유저의 등록한 장소 수정
router.put('/user/place/update',);

