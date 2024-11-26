export interface IUserAuthService {
    loginUser(id: string): Promise<boolean>;
    logoutUser(id: string): Promise<boolean>;
    createNicknamebyUserID(id: string, nickname: string): Promise<any | null>;

}