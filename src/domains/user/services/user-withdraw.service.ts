import { SocialUserService } from "./social-user.service";
import { UserService } from "./user.service"
import { Inject, Service } from "typedi";
import KakaoClient from "@/api/kakao.client";
import { DatabaseError, NotFoundError, ValidationError } from "@/common/exceptions/app.errors";
import { SocialUser } from "../entities/social-user.entity";
import { User } from "../entities/user.entity";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import { UserLogoutService } from "./user-logout.service";
import { logger } from "@/common/utils/logger";
import { TransactionManager } from "@/config/database/transaction_manger";


@Service()
export class UserWithdrawService {
    constructor(
        @Inject(() => UserService) private useService: UserService,
        @Inject(() => SocialUserService) private socialuserService: SocialUserService,
        @Inject(() => KakaoClient) private kakaoClient: KakaoClient,
        @Inject(() => UserLogoutService) private UserLogoutService: UserLogoutService,
        @Inject(() => TransactionManager) private transactionManager: TransactionManager,
    ) { }

    //자체 회원 탈퇴
    // • 회원탈퇴를 누르면 본인인증 후
    // • 통합 회원 탈퇴 인지 자체 탈퇴인지 선택
    // • 통합 회원 탈퇴 시 user 테이블을 없앰
    // • 자체 회원 탈퇴 시 user_id password를 null로 바꾸고 deleted at을 시간 저장함

    public async withdraw(id: number, delete_type: userType, client_type: SESSION_TYPE): Promise<boolean> {
        logger.info(`Starting withdrawal process for user ID: ${id}, delete_type: ${delete_type}`);

        try {
            //사용자 조회
            const user = await this.useService.findUserByID(id).catch(() => null);
            if (!user) {
                logger.warn(`User not found for ID: ${id}`);
                throw new NotFoundError("유저를 찾을 수 없습니다");
            }
            switch (delete_type) {
                case userType.ANYWHERE:
                    logger.info(`Processing Anywhere user withdrawal for user ID: ${id}`);
                    if (user.anywhere_id) {
                        logger.info(`Anywhere user logout for anywhere ID: ${user.anywhere_id}`);
                        await this.UserLogoutService.logoutAnywhere(user.anywhere_id, client_type);
                    }
                    const deleted_anywhere_user = await this.useService.updateUserByID(id, {
                        anywhere_id: null,
                        password_hash: null,
                        deleted_at: new Date(),
                    });
                    logger.info(`Anywhere user ID: ${id} deleted successfully`);
                    return !!deleted_anywhere_user;

                case userType.GOOGLE:
                    logger.warn(`Google withdrawal not implemented yet`);
                    throw new NotFoundError(`Google withdrawal not implemented yet`);

                case userType.KAKAO:
                    return await this.withdrawSocial(user.id, userType.KAKAO, client_type);

                case userType.All:
                    logger.info(`Processing full account deletion for user ID: ${id}`);
                    const deleted_all_user = await this.useService.deleteUserByID(id);
                    logger.info(`User ID: ${id} deleted successfully`);
                    return !!deleted_all_user;

                default:
                    logger.warn(`Invalid user type: ${delete_type}`);
                    throw new ValidationError(`Invalid user type: ${delete_type}`);
            }
        } catch (err) {
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new DatabaseError("Failed to process user withdrawal", err as Error);
        }
    }

    //소셜 회원 탈퇴
    //• 회원탈퇴를 누르면 본인인증 후
    //• 통합 회원 탈퇴 인지 소셜 탈퇴인지 선택
    //•통합 회원 탈퇴시 user 테이블 및 socialuser테이블을 없앰
    // •소셜 회원 탈퇴시
    // •social_user의 user_id를 기억해놓음
    // •해당 social(provider)의 social_user를 탈퇴 시킴
    // •social_user의 user_id가 0 or null이고 user테이블의 id의 anywhere_id가 null이면 (해당 회원이 소셜 아이디 1개 밖에 없는 경우)
    // •user 계정도 삭제시킴.
    // •그 외의 경우( 자체 회원이나 다른 소셜이 있는 경우) 냅둠.

    public async withdrawSocial(user_id: number, usertype: userType, client_type: SESSION_TYPE): Promise<boolean> {
        logger.info(`Starting social withdrawal process for user ID: ${user_id}, userType: ${userType}`);

        try {
            const result = await this.transactionManager.execute(async (queryRunner) => {
                // 소셜 유저 조회
                const social_user: SocialUser | null = await this.socialuserService.findSocialUserByUserID(user_id, usertype, queryRunner).catch(() => null);
                const user: User | null = await this.useService.findUserByID(user_id, queryRunner).catch(() => null);
                if (!social_user) {
                    logger.warn(`Social user not found for user ID: ${user_id}, userType: ${userType}`);
                    throw new NotFoundError(`Social user with ID(${user_id}) not found for type: ${usertype}`);
                }

                switch (usertype) {
                    case userType.KAKAO:

                        // 토큰 갱신 
                        logger.debug(`Refreshing token for social user refresh_token: ${social_user.refresh_token}`);
                        const data = await this.kakaoClient.refresh_token(social_user.refresh_token);
                        const access_token = data.access_token;

                        //카카오 연결 끊기기
                        logger.info(`Unlinking Kakao account for user ID: ${social_user.id}`);
                        const kakao_id = await this.kakaoClient.unlink(access_token);
                        logger.info(`Kakao user unlinked: ${kakao_id}`);
                        break;

                    case userType.GOOGLE:
                        logger.warn("Google unlink feature not implemented yet");
                        throw new NotFoundError("Google unlink feature not implemented yet");

                    default:
                        logger.warn(`Unsupported user type: ${userType}`);
                        throw new ValidationError(`Unsupported user type: ${usertype}`);
                }

                // 소셜 유저 삭제
                const deleted_social_user = await this.socialuserService.deleteSocialUserByID(social_user.id, queryRunner);
                logger.info(`Social user ID: ${social_user.id} deleted successfully`);
                const social_users: SocialUser[] | null = await this.socialuserService.findSocialUsersByUserID(user_id, queryRunner);

                if (social_users?.length === 0 && !user?.anywhere_id) {
                    logger.info(`Deleting user account for user ID: ${user_id} as no social accounts remain`);
                    const deleted_user = await this.useService.deleteUserByID(user_id, queryRunner).catch(() => null);
                    if (!deleted_user) {
                        throw new DatabaseError(`Failed to delete user with ID(${user_id}) after social account deletion`);
                    }
                    logger.info(`User account deleted successfully for user ID: ${user_id}`);
                }

                return !!deleted_social_user;
            });

            return result;
        } catch (err) {
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new DatabaseError("Failed to process social user withdrawal", err as Error);
        }
    }


}

export default UserWithdrawService;