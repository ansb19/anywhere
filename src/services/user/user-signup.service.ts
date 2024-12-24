import { error } from "console";
import { SocialUser } from "../../entities/social-user.entity";
import { User } from "../../entities/user.entity";
import { formatPhoneNumber } from "../../utils/formatter";

import { EmailAuthService } from "../auth/email-auth.service";
import { KakaoService } from "../auth/kakao-auth.service";
import { PasswordService } from "../auth/password.service";
import RedisService from "../auth/redis.service";
import { SMSAuthService } from "../auth/sms-auth.service";
import { SocialUserService } from "./social-user.service";
import { UserService } from "./user.service";
import { userType, verifyResult } from "../../utils/define-type";
import { Token } from "../auth/i-social-auth.service";

export class UserSignupService {
    constructor(
        private userService: UserService,
        private socialuserService: SocialUserService,
        private emailAuthService: EmailAuthService,
        private smsAuthService: SMSAuthService,
        private passwordService: PasswordService,
        private kakaoService: KakaoService,
    ) {

    }

    //자체 회원 가입 
    public async signup(userData: Partial<User>): Promise<boolean> {
        //1. 아이디 중복확인이 되었는지 체크 (프론트)
        //2. 닉네임이 중복확인이 되었는지 체크 (프론트)
        //2. 비밀번호 더블 체크(프론트) 후 해쉬화
        //3. 이메일 인증번호가 맞는지 확인(프론트)
        //4. 휴대폰 인증번호가 맞는지 확인(프론트)
        //5. 


        userData.password_hash = await this.passwordService.hashPassword(userData.password_hash || '');
        await this.userService.createUser(userData);

        return true;
    }


    // 중복확인 (아이디, 닉네임)
    public async checkDuplicate(userFactor: User): Promise<boolean> {
        return !!(this.userService.checkDuplicate(userFactor)); //존재하면 true 아니면 false
    }

    //이메일 인증번호 전송
    public async sendCertEMail(email_address: string): Promise<void> {
        await this.emailAuthService.sendVerification(email_address);
    }

    //sms 인증번호 전송
    public async sendCertSMS(phone: string): Promise<void> {
        await this.smsAuthService.sendVerification(phone);
    }

    // 인증확인 (이메일, sms)
    public async checkCert(userFactor: string, submitted_code: string): Promise<verifyResult> {
        const save_code: string | null = await RedisService.getSession(userFactor);

        if (save_code == submitted_code) {
            return verifyResult.VERIFIED;
        }
        else if (save_code == null) {
            return verifyResult.EXPIRED;
        }
        else {
            return verifyResult.INVALID;
        }
    }


    //카카오 소셜 가입
    public async signupKakaoUser(code: string): Promise<SocialUser> {
        const token = await this.kakaoService.request_token(code);
        
        const kakaoUserInfo = await this.kakaoService.request_user_info(token.access_token);

        const existkakaoUser: SocialUser | null =
            await this.socialuserService.findOneSocialUserbyProviderID(kakaoUserInfo.id, userType.KAKAO);

        if (existkakaoUser) {
            // 로그인 
            console.log(existkakaoUser);
            return existkakaoUser;
            
        }

        else {
            const newUser = await this.userService.createUser({ // 유저 생성
                phone: formatPhoneNumber(kakaoUserInfo.phone),
                email: kakaoUserInfo.email,
                nickname: kakaoUserInfo.nickname,
                profileImage: kakaoUserInfo.profileImage
            });

            const newKakaoUser = await this.socialuserService.createSocialUser({ // 소셜 유저도 생성
                user: newUser,
                provider_name: userType.KAKAO,
                provider_user_id: kakaoUserInfo.id
            });

            const refresh_token_key = `refresh_token:${newKakaoUser.id}`;
            await RedisService.setSession(refresh_token_key, token.refresh_token, token.refresh_token_expires_in);

            return newKakaoUser;
        }
    }

}

export default UserSignupService;