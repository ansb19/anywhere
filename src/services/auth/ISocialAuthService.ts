export interface ISocialAuthService {
    getAccessToken(code: string): Promise<string>; // Authorization Code로 액세스 토큰 가져오기
    getUserInfo(accesssToken: string): Promise<SoicalUser>; // 액세스 토큰으로 사용자 정보 가져오기
}

export interface SoicalUser {
    id: string; //소셜 서비스에서 제공하는 고유 ID
    email?: string; // 이메일 (선택 제공)
    nickname: string; // 닉네임 또는 이름
    profileImage?: string; //url s3
    phone: string;
}