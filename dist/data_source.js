"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_host = process.env.DB_HOST_NAME || "localhost";
const db_user_name = process.env.DB_USER_NAME || "my_username";
const db_password = process.env.DB_PASSWORD || "my_password";
const db_database = process.env.DB_DATABASE || "my_database";
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: db_host,
    port: 5432,
    username: db_user_name,
    password: db_password,
    database: db_database,
    synchronize: true, // 개발 환경에서 true 사용 환경에서는 false
    logging: true,
    entities: [
        process.env.NODE_ENV === "production"
            ? "dist/entity/*.js"
            : "src/entity/*.ts"
    ], //db 테이블 추가 개념
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});
exports.default = exports.AppDataSource;
