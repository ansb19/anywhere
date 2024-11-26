
import { User } from '../../entities/User';
import { IUserService } from './IUserService';
import Service from '../Service';
import { IUserAuthService } from './IUserAuthService';


export class UserService extends Service<User> implements IUserService, IUserAuthService {
    constructor() {
        super(User);
    }
    //유저 생성(회원가입)
    public async createUser(userData: Partial<User>): Promise<User> {
        return await this.create(userData);
    }
    //사용자 전부 조회(정보 조회)
    public async findAllUser(): Promise<User[]> {
        return await this.repository.find();
    }
    //유저 로그인
    public async loginUser(id: string): Promise<boolean> {
        return await this.findOnebyId({ id })
            ? true
            : false
            ;
    }

    //미완성//사용자 로그아웃
    public async logoutUser(id: string): Promise<boolean> {
        return true;
    }

    //특정 유저의 닉네임 생성
    public async createNicknamebyUserID(id: string, nickname: string): Promise<User | null> {
        const user = await this.findOnebyId(id);
        if (user) {
            this.repository.merge(user, { 'nickname': nickname });
            return await this.repository.save(user);
        }
        return null;
    }

    //특정 닉네임의 사용자 정보 조회
    public async findUserbyNickname(nickname: string): Promise<User | undefined | null> { //인터페이스에 의한 새로운 강제 구현
        return await this.repository.findOneBy({ nickname });
    }

    // 닉네임을 이용한 특정 사용자 수정
    public async updateUserbyNickname(nickname: string, userData: any): Promise<User | null> { //상속 하지 않음
        const user = await this.findUserbyNickname(nickname);
        if (user) {
            this.repository.merge(user, userData);
            return await this.repository.save(user);
        }
        return null;
    }

    //닉네임을 이용한 특정 사용자 삭제
    public async deleteUserbyNickname(nickname: string): Promise<boolean> {
        const user = await this.findUserbyNickname(nickname);
        if (user) {
            return await this.delete(user.account_email);

        }
        return false;
    }




}

export default new UserService();