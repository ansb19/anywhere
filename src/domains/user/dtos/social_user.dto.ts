import { SocialUser } from "../entities/social-user.entity";



export class ResponseSocialUserDTO {
    id!: number;
    user!: {
        id: number;
        phone: string;
        email: string;
        nickname: string;
        profileImage: string;
    };
    provider_name!: string;
    provider_user_id!: string;
    created_at!: Date;

    constructor(entity: SocialUser) {
        this.id = entity.id;
        this.user = {
            id: entity.user.id,
            phone: entity.user.phone,
            email: entity.user.email,
            nickname: entity.user.nickname,
            profileImage: entity.user.profileImage,
        }
        this.provider_name = entity.provider_name;
        this.provider_user_id = entity.provider_user_id;
        this.created_at = entity.created_at;
    }
}