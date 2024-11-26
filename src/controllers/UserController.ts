import { Request, Response } from 'express';
import Controller from './Controller';
import UserService from '../services/user/UserService';

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
    //사용자 전부 조회(정보 조회)
    public findAllUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const user = await UserService.findAllUser();

            if (user) {
                return {
                    status: 200,
                    message: "유저들 정보 조회 완료",
                    data: user
                }
            }
            else {
                return {
                    status: 404,
                    message: "유저를 찾을 수 없습니다",
                    data: null
                }
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

    //미완성 사용자 로그아웃
    public logoutUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    //특정 유저의 닉네임 생성
    public createNicknamebyUserID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { id, nickname } = req.body;
            const newNickname = await UserService.createNicknamebyUserID(id, nickname);
            return {
                status: 201,
                message: "닉네임 생성 완료",
                data: newNickname
            }
        })
    }

    //특정 닉네임의 사용자 정보 조회
    public findUserByNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const user = await UserService.findUserbyNickname(nickname);

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

    // 닉네임을 이용한 특정 사용자 수정
    public updateUserbyNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const updateUser = await UserService.updateUserbyNickname(nickname, req.body);

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

    //닉네임을 이용한 특정 사용자 삭제
    public deleteUserbyNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const deleted = await UserService.deleteUserbyNickname(nickname);

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
}


export default new UserController();

