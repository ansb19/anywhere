import { Router } from 'express';
import UserController from '../../controllers/UserController';


//상위 라우터로써  라우터인 '/user/'

const router = Router();


//user의 신상 정보
router.post('/', UserController.createUser); // 사용자 만들기(회원가입)
router.get('/',)       //사용자 전부 조회(정보 조회)
//router.put('/',)       // 사용자 전부 수정(정보 수정)
//router.delete('/',)     // 사용자 전부 삭제(회원 탈퇴)

//router.get('/id/:user_id',)       //특정 사용자 조회(정보 조회)
//router.put('/id/:user_id',)       //특정 사용자 수정(정보 수정)
//router.delete('/id/:user_id',)     //특정 사용자 삭제(회원 탈퇴)

router.post('/login', UserController.loginUser); // 사용자 로그인 //서버를 변경하는 작업이므로 post 사용
router.post('/logout',) //사용자 로그아웃 //서버를 변경하는 작업이므로 post 사용

router.post('/nickname',) // 특정 유저의 닉네임 생성 c
router.get('/nickname/:nickname', UserController.findUserByNickname); // 닉네임을 통한 특정 사용자 전체 정보 조회
router.put('/nickname/:nickname',) // 닉네임을 이용한 특정 사용자 수정
router.delete('/nickname/:nickname',) //닉네임을 이용한 특정 사용자 삭제

export default router;