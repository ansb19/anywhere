import { Router } from 'express';
import Container from 'typedi';
import UserWithdrawaController from '../../controllers/user-withdraw.controller';




//하위 라우터로써  라우터인 '/user/withdraw'
const router = Router();

// 필요한 서비스들을 인스턴스화

const userWithdrawaController = Container.get(UserWithdrawaController);


router.delete('/user_id/:user_id/user_type/:user_type', userWithdrawaController.withdraw_user);


export default router;