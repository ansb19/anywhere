export interface ISocialClient {
    request_token(code: string): Promise<Token>; // Authorization Code로 액세스 토큰 가져오기
    request_user_info(access_token: string): Promise<SoicalUser>; // 액세스 토큰으로 사용자 정보 가져오기
}

export interface SoicalUser {
    id: string; //소셜 서비스에서 제공하는 고유 ID
    email?: string; // 이메일 (선택 제공)
    nickname: string; // 닉네임 또는 이름
    profileImage?: string; //url s3
    phone: string;
}

export interface Token {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    refresh_token_expires_in: number,
}