import { EnvConfig } from "@/config/env-config";
import { createClient, RedisClientType } from "redis";
import { Inject, Service } from "typedi";
import { DatabaseError, NotFoundError } from "../exceptions/app.errors";
import { logger } from "../utils/logger";



@Service()
export class Redis {
    private client: RedisClientType;

    constructor(
        @Inject(() => EnvConfig) private readonly config: EnvConfig,
    ) {
        const redisUrl =
            this.config.NODE_NETWORK === "remote"
                ? this.config.REDIS_REMOTE_URL
                : this.config.REDIS_LOCAL_URL

        logger.info(`Initializing Redis client with URL: ${redisUrl}`);
        try {
            this.client = createClient({ url: redisUrl });
            this.client.on('error', (err) => logger.error('Redis Client Error:', err));
            this.client.connect()
                .then(() => logger.info('Redis connection established successfully.'))
                .catch((err) => {
                    logger.error('Redis connection failed:', err);
                    throw new DatabaseError("Redis 서버에 연결 실패")
                })
        } catch (error) {
            throw new DatabaseError("Redis 클라이언트 초기화 중 오류 발생", error as Error);
        }

    }

    //세션 만들기
    public async set(key: string, value: string, expireTime?: number): Promise<void> {
        try {
            const option = expireTime ? { EX: expireTime } : undefined;
            logger.info(`Setting Redis session - key: ${key}, expireTime: ${expireTime}`);

            await this.client.set(key, value, option); //sec 단위
            logger.info(`Redis session set successfully - key: ${key}`);
        } catch (error) {
            throw new DatabaseError('세션 저장을 중 오류 발생', error as Error);
        }

    }

    //세션 갱신
    public async refresh(key: string, expireTime: number): Promise<void> {
        try {
            logger.info(`Refreshing Redis session - key: ${key}, expireTime: ${expireTime}`);
            const result = await this.client.expire(key, expireTime);
            if (!result) {
                logger.warn(`Redis session not found for key: ${key}`);
                throw new NotFoundError(`키 ${key}를 찾을 수 없음`);
            }
            logger.info(`Redis session refreshed successfully - key: ${key}`);
        } catch (error) {
            throw error instanceof NotFoundError
                ? error
                : new DatabaseError('Redis 세션 갱신 중 오류가 발생', error as Error);
        }
    }

    //세션 조회
    public async get(key: string): Promise<string | null> {
        try {
            logger.info(`Fetching Redis session - key: ${key}`);
            const session_value = await this.client.get(key); //없으면 자동 null 반환
            if (session_value) {
                logger.info(`Redis session found - key: ${key}`);
            } else {
                logger.warn(`Redis session not found - key: ${key}`);
            }
            return session_value;
        } catch (error) {
            throw new DatabaseError(`Redis 세션 조회 중 오류 발생`, error as Error);
        }

    }
    //세션 삭제
    public async delete(key: string): Promise<void> {
        try {
            logger.info(`Deleting Redis session - key: ${key}`);
            const result = await this.client.del(key);
            if (!result) {
                logger.warn(`Redis session not found for key: ${key}`);
                throw new NotFoundError(`키 ${key}를 찾을 수 없음`);
            }
            logger.info(`Redis session deleted successfully - key: ${key}`);
        } catch (error) {
            throw error instanceof NotFoundError
                ? error
                : new DatabaseError("Redis 세션 삭제 중 오류 발생", error as Error);
        }

    }

    public getClient(): RedisClientType {
        logger.info("Returning Redis client.");
        return this.client;
    }

}

export default Redis;