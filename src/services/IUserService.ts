export interface IUserService {
    createUser(userData: any): Promise<any>;
    getUserByNickname(nickname: string): Promise<any | undefined | null>; //?? undefined 넣는 이유 모름
    updateUser(nickname: string, userData: any): Promise<any | null>; //?? null 넣는 이유 모름
    deleteUser(nickname: string): Promise<boolean>;
}

