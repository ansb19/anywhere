import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import { SESSION_CONFIG, SESSION_TYPE } from "@/config/enum_control";
import { DatabaseError, ValidationError } from "../exceptions/app.errors";
import { ExpressSessionService } from "./express.session.service";


@Service()
export class SessionService {
    constructor(@Inject(() => Redis) private redis: Redis,
        @Inject(() => ExpressSessionService) private expressSessionService: ExpressSessionService) {

    }
    /**
     * 세션 생성
     * @param key email -> email, sms -> 휴대폰번호,  login -> userID가 각각 있음
     * @param value 각각의 고유값들이 들어감 
     * @param type email, sms, login 세션 시간 각각 다름
     */
    public async setSession(key: string, value: string, type: SESSION_TYPE): Promise<void> {
        const config = SESSION_CONFIG[type];
        if (!config) throw new ValidationError("세션 타입이 맞지 않습니다");

        const sessionKey = `${config.prefix}:${key}`;
        try {
            await this.redis.set(sessionKey, value, config.ttl);
        } catch (error) {
            console.error(`세션 생성 실패: ${key}, 타입: ${type}`, error);
            throw new DatabaseError("세션 생성 중 문제가 발생했습니다.");
        }
    }
    /**
     * 세션 갱신
     * @param key email -> email, sms -> 휴대폰번호,  login -> userID가 각각 있음
     * @param type 각각의 고유값들이 들어감  email, sms, login
     */
    public async refreshSession(key: string, type: SESSION_TYPE): Promise<void> {
        const sessionKey = `${SESSION_CONFIG[type].prefix}:${key}`;
        await this.redis.refresh(sessionKey, SESSION_CONFIG[type].ttl);
    }

    /**
     * 세션 조회 
     * @param key email -> email, sms -> 휴대폰번호,  login -> userID가 각각 있음
     * @param type email, sms, login 세션 시간 각각 다름
     * @returns 
     */
    public async getSession(key: string, type: SESSION_TYPE): Promise<string | null> {
        const sessionKey = `${SESSION_CONFIG[type].prefix}:${key}`;
        return await this.redis.get(sessionKey).catch(() => null);
    }

    /**
     * 세션 삭제
     * @param key email -> email, sms -> 휴대폰번호,  login -> userID가 각각 있음
     * @param type email, sms, login 세션 시간 각각 다름
     */
    public async deleteSession(key: string, type: SESSION_TYPE): Promise<void> {
        const sessionKey = `${SESSION_CONFIG[type].prefix}:${key}`;
        await this.redis.delete(sessionKey);
    }

    public getMiddlerWare() {
        return this.expressSessionService.getMiddleware();
    }


}