"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_type = process.env.DB_TYPE;
//const db_type: string = process.env.DB_TYPE || "mysql"; string 타입이 아닌 다른 것을 받음
const db_host = process.env.DB_HOST_NAME || "localhost";
const db_port = parseInt(process.env.PORT || "3000", 10);
const db_user_name = process.env.DB_USER_NAME || "my_username";
const db_password = process.env.DB_PASSWORD || "my_password";
const db_DATABASE = process.env.DB_DATABASE || "my_database";
exports.AppDataSource = new typeorm_1.DataSource({
    type: db_type,
    host: db_host,
    port: db_port,
    username: db_user_name,
    password: db_password,
    database: db_DATABASE,
    synchronize: true, // 개발 환경에서 true 사용 환경에서는 false
    logging: false,
    entities: ["src/entity/*.ts"], //db 테이블 추가 개념
    migrations: [],
    subscribers: [],
});
exports.AppDataSource.initialize().then(() => {
    console.log('Data Source is initialzed!');
}).catch((err) => {
    console.error('Data Source is not initalized: ', err);
});
