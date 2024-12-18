import { SocialUser } from "../../entities/SocialUser";
import Service from "../Service";


export class SocialUserService extends Service<SocialUser> {
    constructor() {
        super(SocialUser);
    }

    public async createSocialUser(socialuserData: Partial<SocialUser>): Promise<SocialUser> {
        const newSocialUser = await this.create(socialuserData);
        return newSocialUser;
    }

    public async findOneSocialUserbyID(id: number): Promise<SocialUser | undefined | null> {
        return await this.findOnebyId(id);
    }

    public async updateSocialUserbyID(id: number, socialuserData: Partial<SocialUser>): Promise<SocialUser | null> {
        return await this.update(id, socialuserData);
    }

    public async deleteSocialUserbyID(id: number): Promise<boolean> {
        return await this.delete(id);
    }

    // 소셜 회사 및 id를 통한 조회
    public async findOneSocialUserbyProviderID(provider_user_id: string, provider_name: string): Promise<SocialUser | null> {
        return await this.repository.findOne({
            where: { provider_user_id, provider_name },
            relations: ["user"],
        })
    }


    public async findOneSocialUserbyUSerID(user_id: number, provider_name: string): Promise<SocialUser | null> {
        return await this.repository.findOne({
            where: { user: { id: user_id }, provider_name },
            relations: ["user"],
        })
    }

    //user_id를 이용한 소셜 유저 조회
    public async findSocialUsersbyUSerID(user_id: number): Promise<SocialUser[] | null> {
        return await this.repository.find({
            where: { user: { id: user_id } },
            relations: ["user"],
        })
    }
}

export default new SocialUserService();