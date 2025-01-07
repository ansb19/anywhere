import { Router } from 'express';
import Container from 'typedi';
import UserSignupController from './controllers/user-signup.controller';
import UserWithdrawaController from './controllers/user-withdraw.controller';
import { UserLoginController } from './controllers/user-login.controller';
import { UserLogoutController } from './controllers/user-logout.controller';


export class UserModule {

    static init(): Router {
        const router = Router();
        // 의존성 주입 설정

        // /user의 하위 라우터들

        // 컨트롤러 인스턴스 생성
        const userSignupController = Container.get(UserSignupController);
        const userWithdrawaController = Container.get(UserWithdrawaController);
        const userLoginController = Container.get(UserLoginController);
        const userLogoutController = Container.get(UserLogoutController);
        // const userController = Container.get(UserController);


        // 회원가입
        router.post('/signup/anywhere', userSignupController.signup);
        router.get('/signup/kakao', userSignupController.signupKakaoUser);
        router.post('/signup/kakao/url', userSignupController.signupKaKaoUrl);
        router.post('/signup/check_duplicate', userSignupController.checkDuplicate);

        //회원탈퇴
        router.delete('/withdraw/user_id/:user_id/user_type/:user_type', userWithdrawaController.withdraw_user);

        //로그인
        router.post('/login/anywhere', userLoginController.login_anywhere);
        router.post('/login/social', userLoginController.login_social);

        //로그아웃
        router.post('/logout/anywhere', userLogoutController.logout_anywhere);
        router.post('/logout/social', userLogoutController.logout_social);


        //기본
        // //user의 신상 정보
        // router.post('/manage', UserController.createUser); // 사용자 만들기(회원가입)
        // router.get('/manage', UserController.findAllUser)       //사용자 전부 조회(정보 조회)
        // router.get('/manage/id/:user_id', UserController.findOneUser);
        // router.put('/manage/id/:user_id', UserController.updateUserbyUserID);       // 사용자 수정(정보 수정)
        // router.delete('/manage/id/:user_id', UserController.deleteUserbyUserID);     // 사용자 삭제(회원 탈퇴)
        // router.get('/manage/id/:user_id',)       //특정 사용자 조회(정보 조회)
        // router.put('/manage/id/:user_id',)       //특정 사용자 수정(정보 수정)
        // router.delete('/manage/id/:user_id',)     //특정 사용자 삭제(회원 탈퇴)
        
        
        return router;
    }
}