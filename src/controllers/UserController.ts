import { Request, Response } from 'express';
import Controller from './Controller';
import UserService from '../services/UserService';

class UserController extends Controller {
    //유저 생성(회원가입)
    public createUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            console.log(req.body);
            const newUser = await UserService.createUser(req.body);
            return {
                status: 201,
                message: '유저 회원가입 성공했습니다',
                data: newUser
            }
        })
    }

    //유저 로그인
    public loginUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { id } = req.body;
            const LoginUser = await UserService.loginUser(id);

            if (LoginUser) {
                return {
                    status: 200,
                    message: "유저 로그인 완료",
                    data: LoginUser
                }
            }
            else {
                return {
                    status: 404,
                    message: "유저 로그인 실패",
                    data: LoginUser
                }
            }

        })
    }
    //유저 조회
    public getUserByNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const user = await UserService.getUserByNickname(nickname);

            if (user) {
                return {
                    status: 200,
                    message: "유저 정보 조회 완료",
                    data: user
                }
            }
            else {
                return {
                    status: 404,
                    message: '유저를 찾을 수 없습니다',
                    data: null,

                }
            }

        })
    }

    //유저 업데이트
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const updateUser = await UserService.updateUser(nickname, req.body);

            if (updateUser) {
                return {
                    status: 200,
                    message: '유저가 변경되었습니다',
                    data: updateUser
                }
            }
            else {
                return {
                    status: 404,
                    message: '유저를 찾을 수 없습니다',
                    data: null
                }
            }
        })
    }

    //유저 삭제
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const deleted = await UserService.deleteUser(nickname);

            if (deleted) {
                return {
                    status: 200,
                    data: { message: '유저가 성공적으로 제거되었습니다' }
                }
            }
            else {
                return {
                    status: 404,
                    data: { message: '유저를 찾을 수 없습니다' }
                }
            }
        })
    }

    public test = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const test: string = "test용";
            return {
                status: 200,
                message: 'test용으로 보냅니다',
                data: test
            }
        })

    }
}


export default new UserController();

