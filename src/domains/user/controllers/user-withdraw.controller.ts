import { NextFunction, Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import UserWithdrawService from '../services/user-withdraw.service';
import BaseController from '@/common/abstract/base-controller.abstract';
import { userType } from '@/config/enum_control';


@Service()
class UserWithdrawaController extends BaseController {


    constructor(@Inject(() => UserWithdrawService) private userwithdrawService: UserWithdrawService) {
        super();
    }

    public withdraw_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            this.execute(req, res, next, async () => {
            const user_type = req.params.user_type as userType;
            const user_id = req.params.user_id;
            const withdraw_user = await this.userwithdrawService.withdraw(parseInt(user_id),user_type);

            if (withdraw_user) {
                return {
                    status: 200,
                    message: '유저 삭제 완료',

                }
            }
            else {
                return {
                    status: 404,
                    message: '유저 삭제 실패',
                }
            }
        })
    }
}

export default UserWithdrawaController;