
import BaseController from '@/common/abstract/base-controller.abstract';
import { NextFunction, Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import UserSignupService from '../services/user-signup.service';

@Service()
export class UserSignupController extends BaseController {

    constructor(@Inject(() => UserSignupService) private userSignupService: UserSignupService) {
        super();
    }

    public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            this.execute(req, res, next, async () => {
            const newUser = await this.userSignupService.signup(req.body);
            return {
                status: 201,
                message: '유저 자체 회원가입 성공',
                data: newUser
            }
        })
    }


    public signupKakaoUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const code = req.query.code as string;

            if (!code) {
                return {
                    status: 400,
                    message: `code 값이 필요`,
                    data: code
                }
            }

            const newKakaoUser = await this.userSignupService.signupKakaoUser(code);
            return {
                status: 201,
                message: '유저 카카오 회원가입/로그인 성공',
                data: newKakaoUser
            }
        })
    }

    public checkDuplicate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const userFactor = req.body;

            if (!userFactor || Object.keys(userFactor).length === 0) {
                return {
                    status: 400,
                    message: "userFactor 값이 필요",
                    data: userFactor
                }
            }

            const isDuplicate = await this.userSignupService.checkDuplicate(userFactor);
            return {
                status: 200,
                message: isDuplicate ? "중복된 값이 있습니다." : "중복된 값이 없습니다",
                data: isDuplicate
            }
        })
    }

    // public sendCertSMS = async (req: Request, res: Response): Promise<void> => {
    //     this.execute(req, res, async () => {
    //         const { phone } = req.body;

    //         if (!phone) {
    //             return {
    //                 status: 400,
    //                 message: "휴대폰 번호를 확인해주세요",
    //             }
    //         }

    //         await this.userSignupService.sendCertSMS(phone); //01012345678

    //         return {
    //             status: 200,
    //             message: 'SMS가 전상적으로 전송 되었습니다.',
    //         }

    //     })
    // }

    // public sendCertEmail = async (req: Request, res: Response): Promise<void> => {
    //     this.execute(req, res, async () => {
    //         const { email } = req.body;

    //         if (!req) {
    //             return {
    //                 status: 400,
    //                 message: "이메일을 확인해주세요",
    //             }
    //         }

    //         await this.userSignupService.sendCertEMail(email);

    //         return {
    //             status: 200,
    //             message: '이메일이 전상적으로 전송 되었습니다.',
    //         }

    //     })
    // }

}
export default UserSignupController;