import { Inject, Service } from "typedi";
import { User } from "../entities/user.entity";
import PasswordService from "@/domains/auth/services/password.service";
import UserService from "./user.service";
import SocialUserService from "./social-user.service";
import RedisService from "@/common/services/redis.service";
import { SocialUser } from "../entities/social-user.entity";
import KakaoClient from "@/api/kakao.client";

import { AddDate, formatPhoneNumber } from "@/common/utils/formatter";
import { DatabaseError, DuplicationError, ValidationError } from "@/common/exceptions/app.errors";
import { TransactionManager } from "@/config/database/transaction_manger";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import UserLoginService from "./user-login.service";

@Service()
export class UserSignupService {
    constructor(
        @Inject(() => PasswordService) private passwordService: PasswordService,
        @Inject(() => UserService) private userService: UserService,
        @Inject(() => SocialUserService) private socialUserService: SocialUserService,
        @Inject(() => KakaoClient) private kakaoClient: KakaoClient,
        @Inject(() => TransactionManager) private transactionManager: TransactionManager,
        @Inject(() => UserLoginService) private UserLoginService: UserLoginService,

    ) { }


    /**
     * // 자체 회원 가입
     * @param userData email, nickname, profileimage(선택), phone,
     * anywhere_id, password_hash
     * @returns User의 전체 정보
     */
    public async signup(userData: Partial<User>): Promise<User> {
        try {
            console.log(`userData:${userData.email}`);
            console.log(`userData:${userData.phone}`);
            const is_exist_phone = await this.userService.findOne({
                phone: userData.phone,
            }).catch(() => null);
            const is_exist_anywhere_id = await this.userService.checkDuplicate({
                anywhere_id: userData.anywhere_id,
            });

            userData.password_hash = await this.passwordService.hashPassword(userData.password_hash || '');

            // if (is_exist_phone)
            //     throw new DuplicationError("이미 존재하는 사용자입니다");

            // if (is_exist_anywhere_id)
            //     throw new DuplicationError("이미 사용중인 ID 입니다");

            if (is_exist_anywhere_id && is_exist_phone)
                throw new DuplicationError("이미 존재하는 ID 및 유저입니다");
            else if (is_exist_anywhere_id && !is_exist_phone)
                throw new DuplicationError("이미 사용중인 ID 입니다");
            else if (!is_exist_anywhere_id && is_exist_phone) {
                const intergrated_user = await this.userService.updateUserByID(is_exist_phone.id, userData);
                console.log(`intergrated_user: ${intergrated_user}`);
                return intergrated_user;
            }
            else {
                // 유저 생성
                const new_user = await this.userService.createUser(userData);
                console.log(`new_user: ${new_user}`);
                return new_user;
            }
        } catch (error) {
            console.error("Error during user signup:", error);
            if (error instanceof ValidationError || DuplicationError) {
                throw error; // Validation 관련 에러는 그대로 전달
            }
            throw new DatabaseError("사용자 가입 중 오류 발생", error as Error);
        }
    }


    /**
     * 중복 확인 (아이디, 휴대폰 번호)
     * @param verification anywhere_id, nickname
     * @returns true -> 중복이므로 다른 아이디, false -> 중복 아니므로 해당 아이디 사용가능
     */
    public async checkDuplicate(verification: Partial<User>): Promise<boolean> {
        try {
            return !!(await this.userService.checkDuplicate(verification));
        } catch (error) {
            console.error("Error during duplicate check:", error);
            throw error; // 하위 에러 그대로 전달
        }
    }

    /**
     * 카카오 로그인
     * @returns 카카오 로그인 url (카카오 각종 값들 포함해서 전송)
     */
    public signuKakaopUrl(): string {
        return this.kakaoClient.get_url();
    }


    /**
     * 카카오 소셜 가입
     * @param code 카카오에서 주는 코드 (카카오 url -> 코드 반환)
     * @returns 소셜 유저 전체 정보 반환
     */
    public async signupKakaoUser(code: string, client_type: SESSION_TYPE): Promise<SocialUser | string> {
        try {

            // 1. 카카오 토큰 요청
            const data = await this.kakaoClient.request_token(code);
            const kakaoUserInfo = await this.kakaoClient.request_user_info(data.access_token);

            return this.transactionManager.execute(async (queryRunner) => {
                // 2. 기존 유저 확인
                const existingKakaoUser = await this.socialUserService.
                    findSocialUserByProviderID(kakaoUserInfo.id, userType.KAKAO, queryRunner).catch(() => null);
                console.log(`existingKakaoUser:${existingKakaoUser}`);
                if (existingKakaoUser) {
                    const updated_user = await this.socialUserService.updateSocialUserByID(existingKakaoUser.id, {
                        refresh_token: data.refresh_token,
                        refresh_token_expires_at: AddDate(new Date(), 0, 0, 0, 0, data.refresh_token_expires_in),
                    })
                    await this.UserLoginService.loginSocial(existingKakaoUser.provider_user_id, existingKakaoUser.provider_name as userType, client_type);
                    return updated_user;
                }
                else {
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
                        refresh_token: data.refresh_token,
                        refresh_token_expires_at: AddDate(new Date(), 0, 0, 0, 0, data.refresh_token_expires_in),
                    }, queryRunner);

                    await this.UserLoginService.loginSocial(newKakaoUser.provider_user_id, newKakaoUser.provider_name as userType, client_type);
                    return newKakaoUser;
                }



            });
        } catch (error) {
            console.error("Error during Kakao signup:", error);
            if (error instanceof ValidationError || DuplicationError) {
                throw error; // Validation 관련 에러는 그대로 전달
            }
            throw new DatabaseError("카카오 회원가입 중 오류 발생", error as Error);
        }
    }
}

export default UserSignupService;
