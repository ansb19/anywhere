"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const userService_1 = __importDefault(require("../services/userService"));
class UserController extends Controller_1.default {
    //유저 생성(회원가입)
    createUser = async (req, res) => {
        this.execute(req, res, async () => {
            const newUser = await userService_1.default.createUser(req.body);
            return {
                status: 201,
                data: { message: '유저 회원가입 성공했습니다', data: newUser }
            };
        });
    };
    //유저 조회
    getUserByNickname = async (req, res) => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const user = await userService_1.default.getUserByNickname(nickname);
            if (user) {
                return {
                    status: 200,
                    data: user
                };
            }
            else {
                return {
                    status: 404,
                    data: { message: '유저를 찾을 수 없습니다' }
                };
            }
        });
    };
    //유저 업데이트
    updateUser = async (req, res) => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const updateUser = await userService_1.default.updateUser(nickname, req.body);
            if (updateUser) {
                return {
                    status: 200,
                    data: { message: '유저가 변경되었습니다', data: updateUser }
                };
            }
            else {
                return {
                    status: 404,
                    data: { message: '유저를 찾을 수 없습니다' }
                };
            }
        });
    };
    deleteUser = async (req, res) => {
        this.execute(req, res, async () => {
            const { nickname } = req.params;
            const deleted = await userService_1.default.deleteUser(nickname);
            if (deleted) {
                return {
                    status: 200,
                    data: { message: '유저가 성공적으로 제거되었습니다' }
                };
            }
            else {
                return {
                    status: 404,
                    data: { message: '유저를 찾을 수 없습니다' }
                };
            }
        });
    };
}
exports.default = new UserController();
