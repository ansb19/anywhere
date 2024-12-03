
export interface IUserAuthService {
    loginUser(id: string): Promise<boolean>;
    logoutUser(id: string): Promise<boolean>;
}