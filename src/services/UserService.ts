
import { User } from '../entities/User';
import { IUserService } from './IUserService';
import Service from './Service';


export class UserService extends Service<User> implements IUserService {
    constructor() {
        super(User);
    }

    public async createUser(userData: Partial<User>): Promise<User> {
        return this.create(userData);
    }
    public async getUserByNickname(nickname: string): Promise<User | undefined | null> { //인터페이스에 의한 새로운 강제 구현
        return await this.repository.findOneBy({ nickname });
    }
    public async updateUser(nickname: string, userData: any): Promise<User | null> { //상속 하지 않음
        const user = await this.getUserByNickname(nickname);
        if (user) {
            this.repository.merge(user, userData);
            return await this.repository.save(user);
        }
        return null;
    }
    public async deleteUser(nickname: string): Promise<boolean> {
        const user = await this.getUserByNickname(nickname);
        if (user) {
            return await this.delete(user.account_email);

        }
        return false;
    }




}

export default new UserService();