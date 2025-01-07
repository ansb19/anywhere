import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import { DatabaseError } from "../exceptions/app.errors";
import { logger } from "../utils/logger";

@Service()
export class CachingService {
    constructor(@Inject(() => Redis) private redis: Redis) {

    }

    /**
   * 데이터 캐싱
   * @param prefix 키 네임스페이스 (예: 'user', 'product')
   * @param key 데이터 키
   * @param value 저장할 데이터
   * @param ttl 초 단위 TTL (만료 시간)
   */
    public async set<T>(prefix: string, key: string, value: T, ttl: number): Promise<void> {
        const cacheKey = `${prefix}:${key}`;
        try {
            const serializedValue = JSON.stringify(value);
            logger.info(`Saving cache - Key: ${cacheKey}, TTL: ${ttl} seconds`);
            await this.redis.set(cacheKey, serializedValue, ttl);
            logger.info(`Cache saved successfully - Key: ${cacheKey}`);
        }
        catch (error) {
            throw new DatabaseError("캐시 저장 중 오류 발생");
        }
    }

    /**
     * 캐싱된 데이터 조회
     * @param prefix 키 네임스페이스
     * @param key 데이터 키
     * @returns 캐싱된 데이터 (없으면 null)
     */
    public async get<T>(prefix: string, key: string): Promise<T | null> {
        const cacheKey = `${prefix}:${key}`;
        try {
            logger.info(`Fetching cache - Key: ${cacheKey}`);
            const cachedValue = await this.redis.get(cacheKey);
            if (!cachedValue) {
                logger.warn(`Cache not found - Key: ${cacheKey}`);
                return null;
            }
            logger.info(`Cache found - Key: ${cacheKey}`);
            return JSON.parse(cachedValue) as T;
        } catch (error) {
            throw new DatabaseError("캐시 조회 중 오류 발생");
        }
    }

    /**
     * 캐싱된 데이터 삭제
     * @param prefix 키 네임스페이스
     * @param key 데이터 키
     */
    public async delete(prefix: string, key: string): Promise<void> {
        const cacheKey = `${prefix}:${key}`;
        try {
            logger.info(`Deleting cache - Key: ${cacheKey}`);
            await this.redis.delete(cacheKey);
            logger.info(`Cache deleted successfully - Key: ${cacheKey}`);
        } catch (error) {
            throw new DatabaseError("캐시 삭제 중 오류 발생");
        }
    }

    /**
     * 특정 네임스페이스의 모든 데이터 삭제 (Wildcard 지원)
     * @param prefix 키 네임스페이스
     */
    public async clearNamespace(prefix: string): Promise<void> {
        try {
            logger.info(`Clearing all cache in namespace - Prefix: ${prefix}`);
            const keys = await this.redis.getClient().keys(`${prefix}:*`);
            if (keys.length === 0) {
                logger.warn(`No cache found in namespace - Prefix: ${prefix}`);
                return;
            }

            const pipeline = this.redis.getClient().multi();
            keys.forEach((key) => pipeline.del(key));
            await pipeline.exec();

            logger.info(`Cache cleared successfully in namespace - Prefix: ${prefix}`);
        } catch (error) {
            throw new DatabaseError("네임스페이스 데이터 삭제 중 오류 발생");
        }
    }

}