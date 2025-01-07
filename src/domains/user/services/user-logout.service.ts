import { NotFoundError, ValidationError } from "@/common/exceptions/app.errors";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import { Inject, Service } from "typedi";
import UserService from "./user.service";
import SocialUserService from "./social-user.service";
import KakaoClient from "@/api/kakao.client";


@Service()
export class UserLogoutService {
    constructor(
        @Inject(() => SessionService) private SessionService: SessionService,
        @Inject(() => UserService) private UserService: UserService,
        @Inject(() => SocialUserService) private SocialUserService: SocialUserService,
        @Inject(() => KakaoClient) private KakaoClient: KakaoClient,
    ) {

    }

    public async logoutAnywhere(anywhere_id: string, client_type: SESSION_TYPE): Promise<boolean> {

        try {
            //세선을 없애야함
            const user = await this.UserService.findOne({ anywhere_id });
            if (!user) {
                throw new NotFoundError(`유저 아이디가 틀리거나 존재하지 않습니다.`);
            }
            if (client_type !== (SESSION_TYPE.APP || SESSION_TYPE.WEB))
                throw new ValidationError("Invalid login type");
            const sessionKey = `user:${user.id}:${client_type}`;

            const exist_session = await this.SessionService.getSession(sessionKey, client_type);
            if (exist_session) {
                await this.SessionService.deleteSession(sessionKey, client_type);
                console.log(`세션 sessionKey:${sessionKey}가 삭제되었습니다`);
                return true;
            }
            else
                throw new NotFoundError(`해당 세션이 만료되었거나 존재하지 않습니다`);
        } catch (err) {
            console.error("Error UserLoginService logoutAnywhere: ", err);
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Login process failed", err as Error);
        }
    }

    public async logoutSocial(provider_user_id: string, provider_type: userType, client_type: SESSION_TYPE): Promise<boolean> {
        //세선을 없애야함
        try {
            const socialUser = await this.SocialUserService.findSocialUserByProviderID(provider_user_id, provider_type).catch(() => null);

            if (!socialUser) {
                throw new NotFoundError(`해당 소셜 유저가 없습니다.`);
            }
            if (client_type !== SESSION_TYPE.WEB && client_type !== SESSION_TYPE.APP)
                throw new ValidationError("Invalid login type");


            console.log(`socialUser.refresh_token:${socialUser.refresh_token}`);
            const data = await this.KakaoClient.refresh_token(socialUser.refresh_token);
            console.log(`data: ${typeof data.access_token}`);
            const provider_user_id2 = await this.KakaoClient.logout(data.access_token)

            const sessionKey = `social_user:${socialUser.id}:${client_type}`;

            const exist_session = await this.SessionService.getSession(sessionKey, client_type);
            if (exist_session) {
                await this.SessionService.deleteSession(sessionKey, client_type);
                console.log(`세션 sessionKey:${sessionKey}가 삭제되었습니다`);
                return true;
            }
            else
                throw new NotFoundError(`해당 세션이 만료되었거나 존재하지 않습니다`);

        } catch (err) {
            console.error("Error UserLoginService loginSocial: ", err);
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Social login process failed", err as Error);
        }

    }
}