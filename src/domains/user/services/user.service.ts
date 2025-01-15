import { User } from "../entities/user.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";
import BaseService from "@/common/abstract/base-service.abstract";
import { DeepPartial, QueryRunner } from "typeorm";
import { logger } from "@/common/utils/logger";

@Service()
export class UserService extends BaseService<User> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, User);
    }
    //유저 생성(회원가입)
    public async createUser(userData: DeepPartial<User>, queryRunner?: QueryRunner): Promise<User> {
        const newUser = await this.create(userData, queryRunner);
        return newUser;
    }
    //사용자 전부 조회(정보 조회)
    public async findAllUser(queryRunner?: QueryRunner): Promise<User[]> {
        const find_users = await this.findAll(queryRunner);
        return find_users;
    }

    // id를 통한 사용자 한명 조회
    public async findUserByID(id: number, queryRunner?: QueryRunner): Promise<User | null> {
        const find_user = await this.findOne({ id }, queryRunner); //조건 객체로 전달
        return find_user;
    }

    // id를 통한 사용자 수정
    public async updateUserByID(id: number, userData: DeepPartial<User>, queryRunner?: QueryRunner): Promise<User> { //상속 하지 않음
        const updated_user = await this.update({ id }, userData, queryRunner); //조건 객체로 전달
        return updated_user;
    }

    //id를 이용한 사용자 삭제
    public async deleteUserByID(id: number, queryRunner?: QueryRunner): Promise<User> {
        const deleted_user = await this.delete({ id }, queryRunner);
        return deleted_user;
    }

}

export default UserService;