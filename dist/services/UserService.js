"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../entities/User");
const Service_1 = __importDefault(require("./Service"));
class UserService extends Service_1.default {
    constructor() {
        super(User_1.User);
    }
    async createUser(userData) {
        return this.create(userData);
    }
    async getUserByNickname(nickname) {
        return await this.repository.findOneBy({ nickname });
    }
    async updateUser(nickname, userData) {
        const user = await this.getUserByNickname(nickname);
        if (user) {
            this.repository.merge(user, userData);
            return await this.repository.save(user);
        }
        return null;
    }
    async deleteUser(nickname) {
        const user = await this.getUserByNickname(nickname);
        if (user) {
            return await this.delete(user.account_email);
        }
        return false;
    }
}
exports.UserService = UserService;
exports.default = new UserService();
