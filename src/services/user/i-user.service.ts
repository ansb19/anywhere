import { User } from "../../entities/user.entity";

export interface IUserService {
    createUser(userData: User): Promise<boolean>;
    findAllUser(): Promise<User[]>;
}

