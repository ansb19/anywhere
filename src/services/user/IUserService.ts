export interface IUserService {
    createUser(userData: any): Promise<any>;
    findUserbyNickname(nickname: string): Promise<any | undefined | null>; //?? undefined 넣는 이유 모름
    updateUserbyNickname(nickname: string, userData: any): Promise<any | null>; //?? null 넣는 이유 모름
    deleteUserbyNickname(nickname: string): Promise<boolean>;
    findAllUser(): Promise<any[]>;
}

