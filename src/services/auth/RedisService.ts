import { createClient, RedisClientType } from "redis";

export class RedisService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({ url: "redis://127.0.0.1:6379" });
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