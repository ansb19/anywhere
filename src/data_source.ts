import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const db_type: "mysql" | "mariadb" | "postgres" | "oracle" | "mssql" = (process.env.DB_TYPE as "mysql" | "mariadb" | "postgres" | "oracle" | "mssql");
//const db_type: string = process.env.DB_TYPE || "mysql"; string 타입이 아닌 다른 것을 받음
const db_host: string = process.env.DB_HOST_NAME || "localhost";
const db_port: number = parseInt(process.env.DB_PORT || "5432");
const db_user_name: string = process.env.DB_USER_NAME || "my_username";
const db_password: string = process.env.DB_PASSWORD || "my_password";
const db_database: string = process.env.DB_DATABASE || "my_database";

export const AppDataSource = new DataSource({
    type: db_type,
    host: db_host,
    port: db_port,
    username: db_user_name,
    password: db_password,
    database: db_database,
    synchronize: true, // 개발 환경에서 true 사용 환경에서는 false
    logging: true,
    entities: ["src/entity/*.ts"], //db 테이블 추가 개념
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],

});

export default AppDataSource;