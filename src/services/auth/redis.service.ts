import { createClient, RedisClientType } from "redis";

export class RedisService {
    private client: RedisClientType;

    constructor() {
        const redisUrl =
            process.env.NODE_NETWORK === 'remote'
                ? process.env.REDIS_REMOTE_URL
                : process.env.REDIS_LOCAL_URL;

        this.client = createClient({ url: redisUrl });
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.connect();
    }

    //세션 만들기
    public async setSession(key: string, value: string, expireTime?: number): Promise<void> {
        if (expireTime)
            await this.client.set(key, value, { EX: expireTime }); //sec 단위
        else
            await this.client.set(key, value);
    }

    //세션 갱신
    public async refreshSession(key: string, expireTime: number): Promise<void> {
        await this.client.expire(key, expireTime);
    }

    //세션 조회
    public async getSession(key: string): Promise<string | null> {
        return await this.client.get(key);
    }
    //세션 삭제
    public async deleteSession(key: string): Promise<void> {
        await this.client.del(key);
    }

}

export default new RedisService();