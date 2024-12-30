import { Inject, Service } from "typedi";
import { User } from "../entities/user.entity";
import PasswordService from "@/domains/auth/services/password.service";
import UserService from "./user.service";
import SocialUserService from "./social-user.service";
import { userType } from "@/common/utils/define-type";
import RedisService from "@/common/services/redis.service";
import { SocialUser } from "../entities/social-user.entity";
import KakaoClient from "@/api/kakao.client";

import { formatPhoneNumber } from "@/common/utils/formatter";
import { DatabaseError, ValidationError } from "@/common/exceptions/app.errors";
import { Database } from "@/config/database/Database";
import { TransactionManager } from "@/config/database/transaction_manger";

@Service()
export class UserSignupService {
    constructor(
        @Inject(() => PasswordService) private passwordService: PasswordService,
        @Inject(() => UserService) private userService: UserService,
        @Inject(() => SocialUserService) private socialUserService: SocialUserService,
        @Inject(() => RedisService) private redisService: RedisService,
        @Inject(() => KakaoClient) private kakaoClient: KakaoClient,
        @Inject(() => TransactionManager) private transactionManager: TransactionManager,


    ) { }

    // 자체 회원 가입
    public async signup(userData: Partial<User>): Promise<User> {
        try {
            // 비밀번호 해시화
            userData.password_hash = await this.passwordService.hashPassword(userData.password_hash || '');

            // 유저 생성
            const signedUser = await this.userService.createUser(userData);
            return signedUser;
        } catch (error) {
            console.error("Error during user signup:", error);
            if (error instanceof ValidationError) {
                throw error; // Validation 관련 에러는 그대로 전달
            }
            throw new DatabaseError("사용자 가입 중 오류 발생", error as Error);
        }
    }

    // 중복 확인 (아이디, 닉네임)
    public async checkDuplicate(verification: Partial<User>): Promise<boolean> {
        try {
            return !!(await this.userService.checkDuplicate(verification));
        } catch (error) {
            console.error("Error during duplicate check:", error);
            throw error; // 하위 에러 그대로 전달
        }
    }

    public signuKakaopUrl(){ // 카카오 로그인 url..!
        return this.kakaoClient.get_url();
    }


    // 카카오 소셜 가입
    public async signupKakaoUser(code: string): Promise<SocialUser> {
        try {

            // 1. 카카오 토큰 요청
            const data = await this.kakaoClient.request_token(code);
            const kakaoUserInfo = await this.kakaoClient.request_user_info(data.access_token);

            return this.transactionManager.execute(async (queryRunner) => {
                // 2. 기존 유저 확인
                const existingKakaoUser = await this.socialUserService.
                    findSocialUserByProviderID(kakaoUserInfo.id, userType.KAKAO, queryRunner).catch(() => null);
                if (existingKakaoUser) {
                    console.log("Existing Kakao user found:", existingKakaoUser);
                    return existingKakaoUser;
                }

                // 3. 새로운 유저 생성
                const newUser = await this.userService.createUser({
                    phone: kakaoUserInfo.phone ? formatPhoneNumber(kakaoUserInfo.phone) : null,
                    email: kakaoUserInfo.email,
                    nickname: kakaoUserInfo.nickname,
                    profileImage: kakaoUserInfo.profileImage,
                }, queryRunner);

                // 4. 소셜 유저 생성
                const newKakaoUser = await this.socialUserService.createSocialUser({
                    user: newUser,
                    provider_name: userType.KAKAO,
                    provider_user_id: kakaoUserInfo.id,
                }, queryRunner);

                // 5. Redis에 리프레시 토큰 저장
                const refreshTokenKey = `refresh_token:${newKakaoUser.id}`;
                await this.redisService.setSession(refreshTokenKey, data.refresh_token, data.refresh_token_expires_in);

                return newKakaoUser;
            });
        } catch (error) {
            console.error("Error during Kakao signup:", error);
            if (error instanceof ValidationError) {
                throw error; // Validation 관련 에러는 그대로 전달
            }
            throw new DatabaseError("카카오 회원가입 중 오류 발생", error as Error);
        }
    }
}

export default UserSignupService;
