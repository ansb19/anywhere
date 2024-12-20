import { error } from "console";
import { User } from "../../entities/user.entity";
import { PasswordService } from "../auth/password.service";
import { RedisService } from "../auth/redis.service";
import { UserService } from "./user.service"
import { clientType, userType } from "../../utils/define-type";
import { SocialUser } from "../../entities/social-user.entity";
import { SocialUserService } from "./social-user.service";



export class UserLoginService {
    constructor(
        private userService: UserService,
        private passwordService: PasswordService,
        private redisService: RedisService,
        private socialuserService: SocialUserService,
    ) { }

    //자체 회원
    public async login(anywhere_id: string, password: string, loginType: clientType): Promise<boolean | undefined> {

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

    public async loginSocial(provider_user_id: string, provider_type: userType, loginType: clientType): Promise<boolean> {
        const social_user: Partial<SocialUser | null | undefined> = await this.socialuserService.findOneSocialUserbyProviderID(provider_user_id, provider_type);


        if (social_user) { //소셜 유저가 존재하면
            const sessionkey = `session:${provider_user_id}:${provider_type}:${loginType}`;
            const sessionData = JSON.stringify({
                provider_user_id,
                provider_type,
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

            return !!(social_user);
        }
        else { //소셜 유저가 존재 하지 않으면 false
            return !!(social_user);
        }
    }


}

export default UserLoginService;