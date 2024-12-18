import { error } from "console";
import { User } from "../../entities/User";
import { PasswordService } from "../auth/PasswordService";
import { RedisService } from "../auth/RedisService";
import { UserService } from "./UserService"

export enum clientType {
    WEB = "web",
    APP = "app"
}

export class UserLoginService {
    constructor(
        private userService: UserService,
        private passwordService: PasswordService,
        private redisService: RedisService
    ) { }

    //자체 회원
    public async login(anywhere_id: string, password: string, loginType: string): Promise<boolean | undefined> {

        const user: Partial<User | null | undefined> = await this.userService.findSimple({ anywhere_id });
        if (user) { //유저가 존재하면
            const isPassword: boolean | undefined = await this.passwordService.verifyPassword(password, user.password_hash as string)


            if (isPassword) { //비밀번호가 맞다면

                const sessionkey = `session:${anywhere_id}:${loginType}`;
                const sessionData = JSON.stringify({
                    anywhere_id,
                    loginType,
                    loginTime: new Date(),
                });

                if (loginType === clientType.WEB) { //웹이라면

                    const existSession = await this.redisService.getSession(sessionkey);
                    if (existSession)
                        //이미 세션 있으면 갱신
                        await this.redisService.refreshSession(sessionkey, 60 * 60);
                    else
                        //세션 없으면 생성
                        await this.redisService.setSession(sessionkey, sessionData, 60 * 60);

                }
                else if (loginType === clientType.APP) { //앱이라면
                    //세션 무제한 추가
                    await this.redisService.setSession(sessionkey, sessionData);
                }
                else {
                    throw error("로그인 타입이 문제가 있습니다");
                }

            }
            else { //비밀번호가 틀리다면 false
                return isPassword;
            }
            return isPassword; //패스워드가 맞으면 true 패스워드가 틀리면 false
        }
        else { // 유저가 존재하지 않으면 false
            return !!(user);
        }

    }

    public async loginSocial() {

    }

    public async loginSocialApp() {

    }
}

export default UserLoginService;