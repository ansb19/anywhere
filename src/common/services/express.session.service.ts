import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import EnvConfig from "@/config/env-config";
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { logger } from "../utils/logger";


@Service()
export class ExpressSessionService {
    private sessionMiddleware: any;

    constructor(
        @Inject(() => Redis) private redis: Redis,
        @Inject(() => EnvConfig) private config: EnvConfig
    ) {
        logger.info('Initializing Express session middleware...');
        try {
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
            logger.info('Express session middleware initialized successfully.');
        } catch (error) {
            throw error;
        }



    }

    /**
     * 세션 미들웨어 반환
     */
    public getMiddleware() {
        logger.info('Returning Express session middleware.');
        return this.sessionMiddleware;
    }
}
