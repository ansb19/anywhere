import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import { DatabaseError } from "../exceptions/app.errors";

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
            await this.redis.set(cacheKey, serializedValue, ttl);
            console.log(`[CachingService] 캐시 저장 성공: ${cacheKey}`);
        }
        catch (error) {
            console.error(`[CachingService] 캐시 저장 실패: ${cacheKey}`, error);
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
            const cachedValue = await this.redis.get(cacheKey);
            if (!cachedValue) {
                console.log(`[CachingService] 캐시 조회 실패 (데이터 없음): ${cacheKey}`);
                return null;
            }
            return JSON.parse(cachedValue) as T;
        } catch (error) {
            console.error(`[CachingService] 캐시 조회 실패: ${cacheKey}`, error);
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
            await this.redis.delete(cacheKey);
            console.log(`[CachingService] 캐시 삭제 성공: ${cacheKey}`);
        } catch (error) {
            console.error(`[CachingService] 캐시 삭제 실패: ${cacheKey}`, error);
            throw new DatabaseError("캐시 삭제 중 오류 발생");
        }
    }

    /**
     * 특정 네임스페이스의 모든 데이터 삭제 (Wildcard 지원)
     * @param prefix 키 네임스페이스
     */
    public async clearNamespace(prefix: string): Promise<void> {
        try {
            const keys = await this.redis.getClient().keys(`${prefix}:*`);
            if (keys.length === 0) {
                console.log(`[CachingService] 네임스페이스에 데이터 없음: ${prefix}`);
                return;
            }

            const pipeline = this.redis.getClient().multi();
            keys.forEach((key) => pipeline.del(key));
            await pipeline.exec();

            console.log(`[CachingService] 네임스페이스 데이터 삭제 성공: ${prefix}`);
        } catch (error) {
            console.error(`[CachingService] 네임스페이스 데이터 삭제 실패: ${prefix}`, error);
            throw new DatabaseError("네임스페이스 데이터 삭제 중 오류 발생");
        }
    }

}