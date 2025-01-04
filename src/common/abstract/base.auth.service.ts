import { Service } from "typedi";


@Service()
export abstract class AuthService { //인증 서비스
    abstract sendVerification(identifier: string): Promise<void>;
    //abstract verifyCode(identWifier: string, submitted_code: string): Promise<verifyResult>;
}
