import { createClient, RedisClientType } from "redis";

export class RedisService {
    private client: RedisClientType;

    constructor() {
        const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
        this.client = createClient({ url: redisUrl });
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.connect();
    }

    async set(key: string, value: string, expiredAfterSec: number): Promise<void> {
        await this.client.set(key, value, { EX: expiredAfterSec });
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }
}

export default new RedisService();