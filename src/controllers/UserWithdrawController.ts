import UserWithdrawalService from "../services/user/UserWithdrawalService";
import { Request, Response } from 'express';
import { userType } from "../utils/definetype";
import Controller from "./Controller";

class UserWithdrawaController extends Controller {

    constructor(private userwithdrawService: UserWithdrawalService) {
        super();
    }

    public withdraw_user = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const user_type = req.params.user_type as userType;
            const user_id = req.params.user_id;
            const withdraw_user = await this.userwithdrawService.withdrawal(user_type, parseInt(user_id));

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