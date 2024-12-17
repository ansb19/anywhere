import { User } from "../../entities/User";
import { PasswordService } from "../auth/PasswordService";
import { RedisService } from "../auth/RedisService";
import { UserService } from "./UserService"

export class UserLoginService {
    constructor(
        private userService: UserService,
        private passwordService: PasswordService,
        private redisService: RedisService
    ) { }

    public async login(anywhere_id: string, password: string, loginType: string): Promise<boolean | undefined> {

        const user: Partial<User | null | undefined> = await this.userService.findSimple({ anywhere_id });
        if (user) { //유저가 존재하면
            const isPassword: boolean | undefined = await this.passwordService.verifyPassword(password, user.password_hash as string)

            // 웹이라면 세션 추가
            if (isPassword || loginType === "web") {

            }

            // 앱이라면

            return isPassword; //패스워드가 맞으면 true 패스워드가 틀리면 false
        }
        else { // 유저가 존재하지 않으면
            return !!(user);
        }

    }

    public async loginSocial() {

    }

    public async loginSocialApp() {

    }
}

export default UserLoginService;