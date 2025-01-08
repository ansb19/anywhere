
import BaseController from '@/common/abstract/base-controller.abstract';
import { NextFunction, Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import UserSignupService from '../services/user-signup.service';
import { SESSION_TYPE } from '@/config/enum_control';
import { NotFoundError, ValidationError } from '@/common/exceptions/app.errors';
import { logger } from '@/common/utils/logger';
import { CreateUserDTO, ResponseUserDTO } from '../dtos/user.dto';
import { validateOrReject } from 'class-validator';
import { Mapper } from '@/common/services/mapper';

@Service()
export class UserSignupController extends BaseController {

    constructor(@Inject(() => UserSignupService) private userSignupService: UserSignupService) {
        super();
    }
    // 자체 회원가입
    public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received signup request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            logger.info('req.body change CreateUserDTO');

            const createUserDTO = new CreateUserDTO(req.body);

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(createUserDTO)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

            const new_user = await this.userSignupService.signup(createUserDTO);

            const responseUserDTO = Mapper.toDTO(new_user,ResponseUserDTO)
            //const responseUserDTO = new ResponseUserDTO(new_user);
            logger.info('User signup completed successfully');
            return {
                status: 201,
                message: '유저 자체 회원가입 성공',
                data: responseUserDTO
            }
        })
    }

    // 카카오 로그인 URL 생성
    public signupKaKaoUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received signupKaKaoUrl request');

            const kakaoUrl = this.userSignupService.signuKakaopUrl();

            logger.info('Kakao login URL generated successfully');
            return {
                status: 200,
                message: '카카오 로그인 URL 생성 성공',
                data: kakaoUrl,
            }
        })
    }

    // 카카오 회원가입/로그인
    public signupKakaoUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received signupKakaoUser request');

            const code = req.query.code as string;
            const userAgent = req.headers['user-agent'] || '';

            logger.debug(`Request user-agent: ${userAgent}`);
            let client_Type: SESSION_TYPE;

            // 클라이언트 타입 확인
            if (userAgent.includes('MyApp')) {
                client_Type = SESSION_TYPE.APP;
                logger.info(`Client type determined as APP`);
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = SESSION_TYPE.WEB;
                logger.info(`Client type determined as WEB`);
            }
            else {
                logger.warn(`Invalid user-agent: ${userAgent}`);
                throw new NotFoundError(`소셜 회원가입 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }
            if (!code) {
                logger.warn(`Code parameter is missing in signupKakaoUser request`);
                return {
                    status: 400,
                    message: `code 값이 필요`,
                    data: code
                }
            }

            logger.info('Processing Kakao user signup/login');
            const KakaoUser = await this.userSignupService.signupKakaoUser(code, client_Type);

            logger.info('Kakao user signup/login completed successfully');
            return {
                status: 201,
                message: '유저 카카오 회원가입/로그인 성공',
                data: KakaoUser
            }
        })
    }

    public checkDuplicate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received checkDuplicate request');

            const userFactor = req.body;

            if (!userFactor || Object.keys(userFactor).length === 0) {
                logger.warn('UserFactor is missing in checkDuplicate request');
                return {
                    status: 400,
                    message: "userFactor 값이 필요",
                    data: userFactor
                }
            }

            logger.info(`Checking for duplicate user with factor: ${JSON.stringify(userFactor)}`);
            const isDuplicate = await this.userSignupService.checkDuplicate(userFactor);

            logger.info(isDuplicate ? 'Duplicate user found' : 'No duplicate user found');
            return {
                status: 200,
                message: isDuplicate ? "중복된 값이 있습니다." : "중복된 값이 없습니다",
                data: isDuplicate
            }
        })
    }

}
export default UserSignupController;