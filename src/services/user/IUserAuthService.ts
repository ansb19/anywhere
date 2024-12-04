
export interface IUserAuthService {
    loginUser(id: number): Promise<boolean>;
    logoutUser(id: number): Promise<boolean>;
}