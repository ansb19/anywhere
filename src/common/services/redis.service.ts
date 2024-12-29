import { EnvConfig } from "@/config/env-config";
import { createClient, RedisClientType } from "redis";
import { Inject, Service } from "typedi";
import { DatabaseError, NotFoundError } from "../exceptions/app.errors";


@Service()
export class RedisService {
    private client: RedisClientType;

    constructor(
        @Inject(() => EnvConfig) private readonly config: EnvConfig,
    ) {
        const redisUrl =
            this.config.NODE_ENV === 'remote'
                ? this.config.REDIS_REMOTE_URL
                : this.config.REDIS_LOCAL_URL

        try {
            this.client = createClient({ url: redisUrl });
            this.client.on('error', (err) => console.log('Redis Client Error', err));
            this.client.connect()
                .then(() => console.log('Redis 연결 성공'))
                .catch((err) => {
                    console.error("Redis 연결 실패: ", err);
                    throw new DatabaseError("Redis 서버에 연결 실패")
                })
        } catch (error) {
            console.error('Error Redis 클라이언트 초기화 실패: ', error);
            throw new DatabaseError("Redis 클라이언트 초기화 중 오류 발생", error as Error);
        }

    }

    //세션 만들기
    public async setSession(key: string, value: string, expireTime?: number): Promise<void> {
        try {
            const option = expireTime ? { EX: expireTime } : undefined;
            await this.client.set(key, value, option); //sec 단위
        } catch (error) {
            console.error(`Error Redis 세션 저장 실패 키:${key} `, error);
            throw new DatabaseError('세션 저장을 중 오류 발생', error as Error);
        }

    }

    //세션 갱신
    public async refreshSession(key: string, expireTime: number): Promise<void> {
        try {
            const result = await this.client.expire(key, expireTime);
            if (!result) throw new NotFoundError(`키 ${key}를 찾을 수 없음`);
        } catch (error) {
            console.error(`Error Redis 세션 갱신 실패 key: ${key} `, error);
            throw error instanceof NotFoundError 
            ? error 
            : new DatabaseError('Redis 세션 갱신 중 오류가 발생', error as Error);
        }
    }

    //세션 조회
    public async getSession(key: string): Promise<string | null> {
        try {
            return await this.client.get(key); //없으면 자동 null 반환
        } catch (error) {
            console.error(`Error Redis 세션 조회 실패 key: ${key} `, error);
            throw new DatabaseError(`Redis 세션 조회 중 오류 발생`, error as Error);
        }

    }
    //세션 삭제
    public async deleteSession(key: string): Promise<void> {
        try {
            const result = await this.client.del(key);
            if (!result) throw new NotFoundError(`키 ${key}를 찾을 수 없음`);
        } catch (error) {
            console.error(`Error Redis 세션 삭제 실패 키: ${key} `,error);
            throw error instanceof NotFoundError
            ? error
            : new DatabaseError("Redis 세션 삭제 중 오류 발생", error as Error);
        }
        
    }

}

export default RedisService;