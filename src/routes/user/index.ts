import { Router } from 'express';
import manageRoutes from './manage';
import signupRoutes from './signup';
import UserService from '../../services/user/user.service';
import UserWithdrawalService from '../../services/user/user-withdraw.service';
import SocialUserService from '../../services/user/social-user.service';
import KakaoService from '../../services/auth/kakao-auth.service';
import UserWithdrawaController from '../../controllers/user-withdraw.controller';

//상위 라우터로써  라우터인 '/user/'

const userWithdrawService = new UserWithdrawalService(UserService, SocialUserService, KakaoService);

const userController = new UserWithdrawaController(userWithdrawService);


//상위 라우터로써  라우터인 '/user/'

const router = Router();

router.use('/manage', manageRoutes);
router.use('/signup', signupRoutes);
router.delete('/withdraw/user_id/:user_id/type/:user_type', userController.withdraw_user);


//router.post('/login', UserController.loginUser); // 사용자 로그인 //서버를 변경하는 작업이므로 post 사용
//router.post('/logout', UserController.logoutUser) //사용자 로그아웃 //서버를 변경하는 작업이므로 post 사용



export default router;