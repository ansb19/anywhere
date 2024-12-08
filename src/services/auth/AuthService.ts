export enum verifyResult {
    VERIFIED = "verified",
    EXPIRED = "expired",
    INVALID = "invalid"
};

abstract class AuthService { //인증 서비스
    abstract sendVerification(identifier: string): Promise<void>;
    //abstract verifyCode(identWifier: string, submitted_code: string): Promise<verifyResult>;


    protected generateVerificationCode(): string {
        //여섯자리 랜덤 숫자
        const cert_number: string = Math.floor(Math.random() * 900000 + 100000).toString();
        return cert_number;

    }
}

export default AuthService;