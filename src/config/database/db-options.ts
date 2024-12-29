import { DataSourceOptions } from "typeorm";
import Container from "typedi";
import { EnvConfig } from "../env-config";

const env_config = Container.get(EnvConfig);

export const postgres: DataSourceOptions = {
    type: env_config.DB_TYPE as "postgres" | "mysql" | "mariadb" | "oracle",
    host: env_config.DB_HOST_NAME,
    port: env_config.DB_PORT,
    username: env_config.DB_USER_NAME,
    password: env_config.DB_PASSWORD,
    database: env_config.DB_DATABASE,
    synchronize: process.env.NODE_ENV === "production"
        ? false
        : true, // 개발 환경에서 true 사용 환경에서는 false
    logging: true,
    entities: [
        process.env.NODE_ENV === "production"
            ? "dist/entities/*.js"
            : "src/entities/*.ts"
    ],
    migrations: [
        process.env.NODE_ENV === "production"
            ? "dist/migration/*.js"
            : "src/migration/*.ts"
    ],
    subscribers: [],

}

