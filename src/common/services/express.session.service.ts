import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import EnvConfig from "@/config/env-config";
import session from 'express-session';
import {RedisStore} from 'connect-redis';


@Service()
export class ExpressSessionService {
    private sessionMiddleware: any;

    constructor(
        @Inject(() => Redis) private redis: Redis,
        @Inject(() => EnvConfig) private config: EnvConfig
    ) {
        
        this.sessionMiddleware = session({
            store: new RedisStore({ client: this.redis.getClient() }),
            secret: this.config.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: this.config.NODE_ENV === "production",
                maxAge: undefined, // 세션 유형별로 다르게 설정 가능
            },
        });
    }

    public getMiddleware() {
        return this.sessionMiddleware;
    }
}
