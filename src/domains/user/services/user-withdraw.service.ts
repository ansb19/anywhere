
import { userType } from "@/common/utils/define-type";
import { SocialUserService } from "./social-user.service";
import { UserService } from "./user.service"
import { error } from "console";

import { Inject, Service } from "typedi";
import KakaoClient from "@/api/kakao.client";
import RedisService from "@/common/services/redis.service";
import { DatabaseError, NotFoundError, ValidationError } from "@/common/exceptions/app.errors";
import { SocialUser } from "../entities/social-user.entity";
import { User } from "../entities/user.entity";


@Service()
export class UserWithdrawService {
    constructor(
        @Inject(() => UserService) private useService: UserService,
        @Inject(() => SocialUserService) private socialuserService: SocialUserService,
        @Inject(() => KakaoClient) private kakaoClient: KakaoClient,
        @Inject(() => RedisService) private redis: RedisService
    ) { }

    //자체 회원 탈퇴
    // • 회원탈퇴를 누르면 본인인증 후
    // • 통합 회원 탈퇴 인지 자체 탈퇴인지 선택
    // • 통합 회원 탈퇴 시 user 테이블을 없앰
    // • 자체 회원 탈퇴 시 user_id password를 null로 바꾸고 deleted at을 시간 저장함

    public async withdraw(id: number, delete_type: userType): Promise<boolean> {
        try {
            const user = await this.useService.findUserByID(id);

            switch (delete_type) {
                case userType.ANYWHERE:
                    const deleted_anywhere_user = await this.useService.updateUserByID(id, {
                        anywhere_id: null,
                        password_hash: null,
                        deleted_at: new Date(),
                    });
                    return !!deleted_anywhere_user;

                case userType.GOOGLE:
                    throw new NotFoundError(`Google withdrawal not implemented yet`);

                case userType.KAKAO:
                    return await this.withdrawSocial(user.id, userType.KAKAO);

                case userType.All:
                    const deleted_all_user = await this.useService.deleteUserByID(id);
                    return !!deleted_all_user;

                default:
                    throw new ValidationError(`Invalid user type: ${delete_type}`);
            }
        } catch (err) {
            console.error("Error in UserWithdrawService.withdraw: ", err);
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

    public async withdrawSocial(user_id: number, usertype: userType): Promise<boolean> {
        try {
            const social_user: SocialUser | null = await this.socialuserService.findSocialUserByUserID(user_id, usertype).catch(() => null);
            const user: User | null = await this.useService.findUserByID(user_id).catch(() => null);

            if (!social_user) {
                throw new NotFoundError(`Social user with ID(${user_id}) not found for type: ${usertype}`);
            }

            const deleted_social_user = await this.socialuserService.deleteSocialUserByID(social_user.id);
            
            console.log(`social_user 토큰: ${social_user.refresh_token}`);
            const data = await this.kakaoClient.refresh_token(social_user.refresh_token);

            console.log(`access_token 토큰: ${data.access_token}`);
            const access_token = data.access_token;

            switch (usertype) {
                case userType.KAKAO:
                    const kakao_id = await this.kakaoClient.unlink(access_token);
                    console.log(`카카오 사용자: ${kakao_id} 가 삭제되었습니다`);
                    break;

                case userType.GOOGLE:
                    throw new NotFoundError("Google unlink feature not implemented yet");

                default:
                    throw new ValidationError(`Unsupported user type: ${usertype}`);
            }

            const social_users: SocialUser[] | null = await this.socialuserService.findSocialUsersByUserID(user_id)
                .catch(() => null);

            console.log(`social_users: ${social_users}, ${social_users?.length}`);
            console.log(`user.anywhere_id: ${user?.anywhere_id}`);
            if (social_users?.length ===0 && !user?.anywhere_id) {
                const deleted_user = await this.useService.deleteUserByID(user_id).catch(() => null);
                if (!deleted_user) {
                    throw new DatabaseError(`Failed to delete user with ID(${user_id}) after social account deletion`);
                }
            }

            return !!deleted_social_user;
        } catch (err) {
            console.error("Error in UserWithdrawService.withdrawSocial: ", err);
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new DatabaseError("Failed to process social user withdrawal", err as Error);
        }
    }

    
}

export default UserWithdrawService;