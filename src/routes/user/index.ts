import { Router } from 'express';
import manageRoutes from './manage';
import signupRoutes from './signup';
import UserController from '../../controllers/UserController';
import UserService from '../../services/user/UserService';
import UserWithdrawalService from '../../services/user/UserWithdrawalService';
import SocialUserService from '../../services/user/SocialUserService';
import KakaoService from '../../services/auth/KakaoService';

//상위 라우터로써  라우터인 '/user/'

const userWithdrawService = new UserWithdrawalService(UserService, SocialUserService, KakaoService);

const userController = new UserController(userWithdrawService, UserService);


//상위 라우터로써  라우터인 '/user/'

const router = Router();

router.use('/manage', manageRoutes);
router.use('/signup', signupRoutes);
router.delete('/withdraw', userController.withdraw_user);


//router.post('/login', UserController.loginUser); // 사용자 로그인 //서버를 변경하는 작업이므로 post 사용
//router.post('/logout', UserController.logoutUser) //사용자 로그아웃 //서버를 변경하는 작업이므로 post 사용



export default router;