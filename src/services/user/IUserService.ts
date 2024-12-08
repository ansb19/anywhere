import { User } from "../../entities/User";

export interface IUserService {
    createUser(userData: User): Promise<boolean>;
    findAllUser(): Promise<User[]>;
}

