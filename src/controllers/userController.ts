import { Request, Response } from 'express';
import Controller from './Controller';
import UserService from '../services/userService';

class UserController extends Controller {
    //유저 생성(회원가입)
    public createUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const newUser = await UserService.createUser(req.body);
            return {
                status: 201,
                data: { message: '유저 회원가입 성공했습니다', data: newUser }
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
                    data: user
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

    //유저 업데이트
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const updateUser = await UserService.updateUser(nickname, req.body);

            if (updateUser) {
                return {
                    status: 200,
                    data: { message: '유저가 변경되었습니다', data: updateUser }
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

}


export default new UserController();

