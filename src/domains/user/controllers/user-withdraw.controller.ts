import { NextFunction, Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import UserWithdrawService from '../services/user-withdraw.service';
import BaseController from '@/common/abstract/base-controller.abstract';
import { SESSION_TYPE, userType } from '@/config/enum_control';
import { NotFoundError } from '@/common/exceptions/app.errors';
import { logger } from '@/common/utils/logger';


@Service()
class UserWithdrawaController extends BaseController {


    constructor(@Inject(() => UserWithdrawService) private userwithdrawService: UserWithdrawService) {
        super();
    }

    public withdraw_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const user_type = req.params.user_type as userType;
            const user_id = req.params.user_id;
            const userAgent = req.headers['user-agent'] || '';

            // 요청 파라미터와 User-Agent 로깅
            logger.debug(`Request params - user_type: ${user_type}, user_id: ${user_id}`);
            logger.debug(`Request user-agent: ${userAgent}`);

            let client_Type: SESSION_TYPE;
            if (userAgent.includes('MyApp')) {
                client_Type = SESSION_TYPE.APP;
                logger.info(`Client type determined as APP for user ID: ${user_id}`);
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = SESSION_TYPE.WEB;
                logger.info(`Client type determined as WEB for user ID: ${user_id}`);
            }
            else {
                logger.warn(`Invalid user-agent: ${userAgent}`);
                throw new NotFoundError(`소셜 회원가입 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            logger.info(`Processing user withdrawal for user ID: ${user_id}, user_type: ${user_type}, client_type: ${client_Type}`);
            const withdraw_user = await this.userwithdrawService.withdraw(parseInt(user_id), user_type, client_Type);

            if (withdraw_user) {
                logger.info(`User ID: ${user_id} withdrawn successfully`);
                return {
                    status: 200,
                    message: '유저 삭제 완료',

                }
            }
            else {
                logger.warn(`Failed to withdraw user ID: ${user_id}`);
                return {
                    status: 404,
                    message: '유저 삭제 실패',
                }
            }
        })
    }
}

export default UserWithdrawaController;