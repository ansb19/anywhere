import BaseService from "@/common/abstract/base-service.abstract";
import { SocialUser } from "../entities/social-user.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";
import { DatabaseError, NotFoundError } from "@/common/exceptions/app.errors";
import { DeepPartial, QueryRunner } from "typeorm";
import { logger } from "@/common/utils/logger";



@Service()
export class SocialUserService extends BaseService<SocialUser> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, SocialUser);
    }

    public async createSocialUser(socialuserData: DeepPartial<SocialUser>, queryRunner?: QueryRunner): Promise<SocialUser> {
        const newSocialUser = await this.create(socialuserData, queryRunner);
        return newSocialUser;
    }

    public async findSocialUserByID(id: number, queryRunner?: QueryRunner): Promise<SocialUser> {
        const find_social_user = await this.findOne({ id }, queryRunner); //조건 객체로 전달
        return find_social_user;
    }

    public async updateSocialUserByID(id: number, socialuserData: DeepPartial<SocialUser>, queryRunner?: QueryRunner): Promise<SocialUser> {
        const updated_social_user = await this.update({ id }, socialuserData, queryRunner);//조건 객체로 전달
        return updated_social_user;
    }

    public async deleteSocialUserByID(id: number, queryRunner?: QueryRunner): Promise<SocialUser> {
        const deleted_social_user = await this.delete({ id }, queryRunner);
        return deleted_social_user;
    }

    // 소셜 회사 및 id를 통한 조회
    public async findSocialUserByProviderID(provider_user_id: string, provider_name: string, queryRunner?: QueryRunner): Promise<SocialUser> {
        logger.info(`Finding social user by provider_user_id: ${provider_user_id} and provider_name: ${provider_name}`);

        try {
            const social_user = await this.findOneWithRelations({ provider_user_id, provider_name }, ["user"], queryRunner);
            if (!social_user) {
                logger.warn(`No social user found for provider_user_id: ${provider_user_id} and provider_name: ${provider_name}`);
                throw new NotFoundError(`해당 provider_user_id와 provider_name에 맞는 소셜 유저가 없음`);
            }
            logger.info(`Social user found with provider_user_id: ${provider_user_id} and provider_name: ${provider_name}`);
            return social_user;
        } catch (error) {
            throw error;
        }


    }

    public async findSocialUserByUserID(user_id: number, provider_name: string, queryRunner?: QueryRunner): Promise<SocialUser> {
        logger.info(`Finding social user by user_id: ${user_id} and provider_name: ${provider_name}`);
        try {
            const social_user = await this.getRepository(queryRunner).findOne({
                where: { user: { id: user_id }, provider_name },
                relations: ["user"]
            });
            if (!social_user) {
                logger.warn(`No social user found for user_id: ${user_id} and provider_name: ${provider_name}`);
                throw new NotFoundError(`유저 아이디: ${user_id}와 ${provider_name} 맞는 값이 없음`);
            }
            logger.info(`Social user found with user_id: ${user_id} and provider_name: ${provider_name}`);
            return social_user;
        } catch (error) {            
            throw error instanceof NotFoundError
                ? error
                : new DatabaseError("소셜 유저 유저ID를 통한 조회 중 오류 발생");
        }


    }

    //user_id를 이용한 소셜 유저 조회
    public async findSocialUsersByUserID(user_id: number, queryRunner?: QueryRunner): Promise<SocialUser[]> {
        logger.info(`Finding all social users for user_id: ${user_id}`);
        try {
            const social_users = await this.getRepository(queryRunner).find({
                where: { user: { id: user_id } },
                relations: ["user"],
            });
            if (!social_users.length) {
                logger.warn(`No social users found for user_id: ${user_id}`);
            }
            logger.info(`Found ${social_users.length} social users for user_id: ${user_id}`);
            return social_users;
        } catch (error) {
            throw error instanceof NotFoundError
                ? error
                : new DatabaseError("소셜 유저들 유저ID를 통한 조회 중 오류 발생");
        }
    }
}

export default SocialUserService;