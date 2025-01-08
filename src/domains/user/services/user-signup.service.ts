import { Inject, Service } from "typedi";
import { User } from "../entities/user.entity";
import PasswordService from "@/domains/auth/services/password.service";
import UserService from "./user.service";
import SocialUserService from "./social-user.service";
import { SocialUser } from "../entities/social-user.entity";
import KakaoClient from "@/api/kakao.client";

import { AddDate, formatPhoneNumber } from "@/common/utils/formatter";
import { AppError, DatabaseError, DuplicationError } from "@/common/exceptions/app.errors";
import { TransactionManager } from "@/config/database/transaction_manger";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import UserLoginService from "./user-login.service";
import { logger } from "@/common/utils/logger";
import { CreateUserDTO, ResponseUserDTO } from "../dtos/user.dto";
import { Mapper } from "@/common/services/mapper";

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
    public async signup(createUserDTO: CreateUserDTO): Promise<User> {

        logger.info(`Starting signup process for email: ${createUserDTO.email}`);

        try {

            // DTO를 Entity로 변환
            const userEntity = Mapper.toEntity(createUserDTO,User);
            

            logger.debug(`Checking for existing user with phone: ${userEntity.phone}`);
            const existingUser = await this.userService.findOne({
                phone: userEntity.phone,
            }).catch(() => null);

            logger.debug(`Checking for existing user with anywhere_id: ${userEntity.anywhere_id}`);
            const is_exist_anywhere_id = await this.userService.checkDuplicate({
                anywhere_id: userEntity.anywhere_id,
            });

            userEntity.password_hash = await this.passwordService.hashPassword(userEntity.password_hash || '');
            logger.debug(`Password hashed for user: ${userEntity.email}`);


            if (is_exist_anywhere_id && existingUser) {
                logger.warn(`Duplicate user found for email: ${userEntity.email} and phone: ${userEntity.phone}`);
                throw new DuplicationError("이미 존재하는 ID 및 유저입니다");
            }
            else if (is_exist_anywhere_id && !existingUser) {
                logger.warn(`Duplicate ID found for anywhere_id: ${userEntity.anywhere_id}`);
                throw new DuplicationError("이미 사용중인 ID 입니다");
            }
            else if (!is_exist_anywhere_id && existingUser) {
                logger.info(`Integrating existing user with phone: ${userEntity.phone}`);
                const integrated_user = await this.userService.updateUserByID(existingUser.id, userEntity);
                logger.info(`User integrated successfully: ${integrated_user.id}`);
                return integrated_user;
            }
            else {
                // 유저 생성
                logger.info(`Creating new user for email: ${userEntity.email}`);
                const new_user = await this.userService.createUser(userEntity);
                logger.info(`User created successfully with ID: ${new_user.id}`);

               return new_user;
            }
        } catch (error) {
            if (error instanceof DuplicationError) {
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
        logger.info(`Checking for duplicate user with: ${JSON.stringify(verification)}`);
        try {
            const result = await this.userService.checkDuplicate(verification);
            logger.info(`Duplicate check result: ${result}`);
            return !!(result);
        } catch (error) {
            throw error; // 하위 에러 그대로 전달
        }
    }

    /**
     * 카카오 로그인
     * @returns 카카오 로그인 url (카카오 각종 값들 포함해서 전송)
     */
    public signuKakaopUrl(): string {
        const url = this.kakaoClient.get_url();
        logger.info(`Generated Kakao signup URL: ${url}`);
        return url;
    }


    /**
     * 카카오 소셜 가입
     * @param code 카카오에서 주는 코드 (카카오 url -> 코드 반환)
     * @returns 소셜 유저 전체 정보 반환
     */
    public async signupKakaoUser(code: string, client_type: SESSION_TYPE): Promise<SocialUser> {
        logger.info(`Starting Kakao signup process with code: ${code}`);
        try {
            // 1. 카카오 토큰 요청
            const data = await this.kakaoClient.request_token(code);
            logger.debug(`Received Kakao token: ${JSON.stringify(data)}`);

            const kakaoUserInfo = await this.kakaoClient.request_user_info(data.access_token);
            logger.debug(`Received Kakao user info: ${JSON.stringify(kakaoUserInfo)}`);

            const result = await this.transactionManager.execute(async (queryRunner) => {
                // 2. 기존 유저 확인
                const existingKakaoUser = await this.socialUserService.
                    findSocialUserByProviderID(kakaoUserInfo.id, userType.KAKAO, queryRunner).catch(() => null);

                if (existingKakaoUser) {
                    logger.info(`Existing Kakao user found: ${existingKakaoUser.id}`);
                    const updated_user = await this.socialUserService.updateSocialUserByID(existingKakaoUser.id, {
                        refresh_token: data.refresh_token,
                        refresh_token_expires_at: AddDate(new Date(), 0, 0, 0, 0, data.refresh_token_expires_in),
                    });

                    logger.info(`Kakao user updated and logged in: ${updated_user.id}`);
                    return updated_user;
                }
                else { //유저가 없을 때
                    // 3. 새로운 유저 생성
                    logger.info(`Creating new Kakao user`);
                    const newUser = await this.userService.createUser({
                        phone:formatPhoneNumber(kakaoUserInfo.phone),
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

                    logger.info(`New Kakao user created successfully: ${newKakaoUser.id}`);
                    return newKakaoUser;
                }

            });
            // 4. 트랜잭션 완료 후 로그인 처리
            await this.UserLoginService.loginSocial(kakaoUserInfo.id, userType.KAKAO, client_type);

            logger.info(`User logged in successfully after signup: ${kakaoUserInfo.id}`);
            return result;

        } catch (error) {
            if (error instanceof DuplicationError) {
                throw error; // Validation 관련 에러는 그대로 전달
            }
            throw new DatabaseError("카카오 회원가입 중 오류 발생", error as Error);
        }
    }
}

export default UserSignupService;
