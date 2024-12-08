import bcrypt from "bcrypt";
import coolsms from "coolsms-node-sdk";
import nodemailer from "nodemailer";

export class PasswordService {
    saltRounds: number;
    constructor() {
        this.saltRounds = 10;
    }

    async hashPassword(password: string): Promise<string | undefined> { //비밀번호 해시
        try {
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            return hashedPassword;
        }
        catch (error) {
            console.error(`Error hashing password: ${error}`);
        }
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean | undefined> { // 비밀번호 해시해제
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match; //true or false;
        }
        catch (error) {
            console.error(`Error verifying password: ${error}`)
        }
    }

}

export default new PasswordService(); 