import BaseService from "@/common/abstract/base-service.abstract";
import { SocialUser } from "../entities/social-user.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";
import { DatabaseError, NotFoundError } from "@/common/exceptions/app.errors";



@Service()
export class SocialUserService extends BaseService<SocialUser> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, SocialUser);
    }

    public async createSocialUser(socialuserData: Partial<SocialUser>): Promise<SocialUser> {
            const newSocialUser = await this.create(socialuserData);
            return newSocialUser;
    }

    public async findSocialUserByID(id: number): Promise<SocialUser> {
            const find_social_user = await this.findOne({ id }); //조건 객체로 전달
            return find_social_user;
    }

    public async updateSocialUserByID(id: number, socialuserData: Partial<SocialUser>): Promise<SocialUser> {
            const updated_social_user = await this.update({ id }, socialuserData);//조건 객체로 전달
            return updated_social_user;
    }

    public async deleteSocialUserByID(id: number): Promise<SocialUser> {
            const deleted_social_user = await this.delete({ id });
            return deleted_social_user;
    }

    // 소셜 회사 및 id를 통한 조회
    public async findSocialUserByProviderID(provider_user_id: string, provider_name: string): Promise<SocialUser> {
            const social_user = await this.findOneWithRelations({ provider_user_id, provider_name }, ["user"]);
            return social_user;
    }

    public async findSocialUserByUserID(user_id: number, provider_name: string): Promise<SocialUser> {

        try {
            const social_user = await this.repository.findOne({
                where: { user: { id: user_id }, provider_name },
                relations: ["user"]
            });
            if (!social_user) throw new NotFoundError(`유저 아이디: ${user_id}와 ${provider_name} 맞는 값이 없음`);
            return social_user;
        } catch (error) {
            console.error('Error social-user.service findSocialUserByUserID: ', error);
            throw error instanceof NotFoundError
                ? error
                : new DatabaseError("소셜 유저 유저ID를 통한 조회 중 오류 발생");
        }


    }

    //user_id를 이용한 소셜 유저 조회
    public async findSocialUsersByUserID(user_id: number): Promise<SocialUser[]> {
        try {
            const social_users = await this.repository.find({
                where: { user: { id: user_id } },
                relations: ["user"],
            })
            if (!social_users) throw new NotFoundError(`유저 아이디: ${user_id} 맞는 값이 없음`);
            return social_users;
        } catch (error) {
            console.error('Error social-user.service findSocialUsersByUSerID: ', error);
            throw error instanceof NotFoundError
                ? error
                : new DatabaseError("소셜 유저들 유저ID를 통한 조회 중 오류 발생");
        }
    }
}

export default SocialUserService;