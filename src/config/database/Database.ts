import { DatabaseError } from "@/common/exceptions/app.errors";
import { Inject, Service } from "typedi";
import { DataSource, DataSourceOptions } from "typeorm";
import { DatabaseConfig } from "./db-options";



@Service()
export class Database {
     readonly dataSource: DataSource;

    constructor(@Inject(() => DatabaseConfig) private options: DatabaseConfig) {
        this.dataSource = new DataSource(this.options.getOptions());
    }

    public async initialize(): Promise<void> {
        try {
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
                console.log("데이터 베이스 초기화 완료");
            }
        } catch (error) {
            console.error("데이터베이스 초기화 중 오류 발생:", error);
            throw new DatabaseError("데이터베이스 초기화 실패", error as Error);
        }

    }

    public async runMigrations(): Promise<void> {
        try {
            await this.dataSource.runMigrations();
            console.log("마이그레이션 완료");
        } catch (error) {
            console.error("마이그레이션 실행 중 오류 발생:", error);
            throw new DatabaseError("마이그레이션 실행 실패", error as Error);
        }
    }

    public async close(): Promise<void> {
        try {
            if (this.dataSource.isInitialized) {
                await this.dataSource.destroy();
                console.log("데이터베이스 연결 종료");
            } else {
                console.warn("데이터베이스 연결이 이미 종료된 상태입니다.");
            }
        } catch (error) {
            console.error("데이터베이스 연결 종료 중 오류 발생:", error);
            throw new DatabaseError("데이터베이스 연결 종료 실패", error as Error);
        }
    }
}
