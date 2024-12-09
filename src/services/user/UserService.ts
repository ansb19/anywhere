import { User } from '../../entities/User';
import Service from '../Service';
import { IUserAuthService } from './IUserAuthService';


export class UserService extends Service<User> implements IUserAuthService {
    constructor() {
        super(User);
    }
    //유저 생성(회원가입)
    public async createUser(userData: Partial<User>): Promise<User> {
        const newUser = await this.create(userData);
        return newUser;
    }
    //사용자 전부 조회(정보 조회)
    public async findAllUser(): Promise<User[]> {
        return await this.repository.find();
    }

    // id를 통한 사용자 한명 조회
    public async findOneUserbyID(id: number): Promise<User | undefined | null> {
        return await this.findOnebyId(id);
    }

    // id를 통한 사용자 수정
    public async updateUserbyID(id: number, userData: User): Promise<User | null> { //상속 하지 않음
        return await this.update(id, userData);
    }

    //id를 이용한 사용자 삭제
    public async deleteUserbyID(id: number): Promise<boolean> {
        return await this.delete(id);
    }

    //임의 특정 조건의 사용자 한 명 조회 ( 중복확인, )
    public async checkDuplicate(condition: Partial<User>): Promise<User | undefined | null> {
        return await this.findSimple(condition);
    }

    //유저 로그인
    public async loginUser(id: number): Promise<boolean> {
        return await this.findOnebyId(id)
            ? true
            : false
            ;
    }

    //미완성//사용자 로그아웃
    public async logoutUser(id: number): Promise<boolean> {
        return true;
    }

}

export default new UserService();