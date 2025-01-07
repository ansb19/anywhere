import { DataSourceOptions } from "typeorm";
import Container, { Inject, Service } from "typedi";
import { EnvConfig } from "../env-config";
import { Serializer } from "v8";
import { logger } from "@/common/utils/logger";



@Service()
export class DatabaseConfig {
    constructor(@Inject(() => EnvConfig) private readonly env_config: EnvConfig) {
    }


    /**
     * 데이터베이스 옵션 설정 메서드
     * @returns DataSourceOptions
     */
    public getOptions(): DataSourceOptions {
        try {
            logger.info(`${this.env_config.DB_TYPE} 설정 초기화 시작...`);

            const options: DataSourceOptions = {
                type: this.env_config.DB_TYPE as "postgres" | "mysql" | "mariadb" | "oracle",
                host: this.env_config.DB_HOST_NAME,
                port: this.env_config.DB_PORT,
                username: this.env_config.DB_USER_NAME,
                password: this.env_config.DB_PASSWORD,
                database: this.env_config.DB_DATABASE,
                synchronize: process.env.NODE_ENV === "production"
                    ? false
                    : true, // 개발 환경에서 true 사용 환경에서는 false
                logging: true,
                entities: [
                    process.env.NODE_ENV === "production"
                        ? "dist/domains/*/entities/*.js" // 배포 환경
                        : "src/domains/*/entities/*.ts" // 개발 환경
                ],
                migrations: [
                    process.env.NODE_ENV === "production"
                        ? "dist/config/database/migration/*.js" // 배포 환경
                        : "src/config/database/migration/*.ts" // 개발 환경
                ],
                subscribers: [],

            }
            logger.info(`${this.env_config.DB_TYPE} 설정 초기화 완료`);
            return options;
        } catch (error) {
            throw error;
        }

    }

}
