// import { Router } from 'express';
// import UserController from '../../controllers/user.controller';



// //하위 라우터로써  라우터인 '/user/manage/.'

// const router = Router();

// //user의 신상 정보
// router.post('/', UserController.createUser); // 사용자 만들기(회원가입)
// router.get('/', UserController.findAllUser)       //사용자 전부 조회(정보 조회)
// router.get('/id/:user_id', UserController.findOneUser);
// router.put('/id/:user_id', UserController.updateUserbyUserID);       // 사용자 수정(정보 수정)
// router.delete('/id/:user_id', UserController.deleteUserbyUserID);     // 사용자 삭제(회원 탈퇴)

// //router.get('/id/:user_id',)       //특정 사용자 조회(정보 조회)
// //router.put('/id/:user_id',)       //특정 사용자 수정(정보 수정)
// //router.delete('/id/:user_id',)     //특정 사용자 삭제(회원 탈퇴)


// export default router;
// 관심사 분리 원칙에 따라 나누기로 함.