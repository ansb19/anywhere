import { DatabaseError } from "@/common/exceptions/app.errors";
import { Service } from "typedi";
import { DataSource, DataSourceOptions } from "typeorm";



@Service()
export class Database {
    private dataSource: DataSource;

    constructor(private options: DataSourceOptions) {
        this.dataSource = new DataSource(this.options);
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

    public getDataSource(): DataSource {
        if (!this.dataSource.isInitialized) {
            throw new DatabaseError("데이터베이스가 초기화되지 않았습니다.");
        }
        return this.dataSource;
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