import { execPath } from "process";
import { SocialUserService } from "./SocialUserService";
import { UserService } from "./UserService"
import { error } from "console";
import { User } from "../../entities/User";

export enum userType {
    KAKAO = "kakao",
    GOOGLE = "google",
    ANYWHERE = "anywhere",
    All = "all"
};

export class UserWithdrawalService {
    constructor(
        private useService: UserService,
        private socialuserService: SocialUserService
    ) { }

    //자체 회원 탈퇴
    // • 회원탈퇴를 누르면 본인인증 후
    // • 통합 회원 탈퇴 인지 자체 탈퇴인지 선택
    // • 통합 회원 탈퇴 시 user 테이블을 없앰
    // • 자체 회원 탈퇴 시 user_id password를 null로 바꾸고 deleted at을 시간 저장함

    public async withdrawal(delete_type: string, id: number): Promise<boolean> {
        const user = await this.useService.findOneUserbyID(id);

        if (!!(user)) { //유저가 존재하면
            if (delete_type === userType.ANYWHERE) { //자체 회원 탈퇴 
                const deleted = await this.useService.updateUserbyID(id, {
                    anywhere_id: null,
                    password_hash: null,
                    deleted_at: new Date()
                })
                return deleted ? true : false;
            }

            else if (delete_type === userType.KAKAO) { //카카오 회원 탈퇴
                return await this.witdrawlSocial(user, userType.KAKAO);
            }

            else if (delete_type === userType.GOOGLE) {
                return await this.witdrawlSocial(user, userType.GOOGLE);
            }
            else if (delete_type === userType.All) { //통합(전부) 회원 탈퇴
                //cascade로 social 테이블도 지워짐.
                const deleted = await this.useService.deleteUserbyID(id);
                return deleted;
            }
            else {
                throw error(`잘못된 유저 타입입니다: ${user}`, error);

            }
        }
        else {
            throw error(`유저를 찾을 수 없습니다`);
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

    public async witdrawlSocial(user: User, usertype: userType): Promise<boolean> {
        const social_user = await this.socialuserService
            .findOneSocialUserbyUSerID(user.id, usertype);

        if (social_user) {
            //소셜 계정 탈퇴
            const deleted = await this.socialuserService.deleteSocialUserbyID(social_user.id);

            if (!deleted)
                throw error("소셜 탈퇴 실패", error);

            const social_users = await this.socialuserService
                .findSocialUsersbyUSerID(user.id); //탈퇴 후 해당 user_id의 소셜 유저들 조회

            if (!social_users && !user.anywhere_id) { //소셜 유저들이 없고 자체 유저도 없으면
                const deleted_user = await this.useService.deleteUserbyID(user.id);
                return deleted_user;
            }


            return deleted;
        }
        else {
            throw error(`해당 소셜 유저가 없습니다: ${social_user}`);
        }
    }


}

export default UserWithdrawalService;