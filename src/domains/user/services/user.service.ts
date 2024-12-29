import { User } from "../entities/user.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";
import BaseService from "@/common/abstract/base-service.abstract";
import { DeepPartial } from "typeorm";
import { DatabaseError } from "../../../../test/app.errors";

@Service()
export class UserService extends BaseService<User> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, User);
    }
    //유저 생성(회원가입)
    public async createUser(userData: DeepPartial<User>): Promise<User> {
        const newUser = await this.create(userData);
        return newUser;
    }
    //사용자 전부 조회(정보 조회)
    public async findAllUser(): Promise<User[]> {
        const find_users = await this.findAll();
        return find_users;
    }

    // id를 통한 사용자 한명 조회
    public async findUserByID(id: number): Promise<User> {
            const find_user = await this.findOne({ id }); //조건 객체로 전달
            return find_user;
    }

    // id를 통한 사용자 수정
    public async updateUserByID(id: number, userData: DeepPartial<User>): Promise<User> { //상속 하지 않음
            const updated_user = await this.update({ id }, userData); //조건 객체로 전달
            return updated_user;
    }

    //id를 이용한 사용자 삭제
    public async deleteUserByID(id: number): Promise<User> {
            const deleted_user = await this.delete({ id });
            return deleted_user;
    }

    //임의 특정 조건의 사용자 한 명 조회 ( 중복확인, 로그인 )
    public async checkDuplicate(condition: Partial<User>): Promise<boolean> {
        const is_user_found = await this.findOne(condition).catch(() => null);
        return !!is_user_found;
    }

}

export default UserService;