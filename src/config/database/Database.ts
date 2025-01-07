import { DatabaseError } from "@/common/exceptions/app.errors";
import { Inject, Service } from "typedi";
import { DataSource, DataSourceOptions } from "typeorm";
import { DatabaseConfig } from "./db-options";
import { logger } from "@/common/utils/logger";



@Service()
export class Database {
    readonly dataSource: DataSource;

    constructor(@Inject(() => DatabaseConfig) private options: DatabaseConfig) {
        this.dataSource = new DataSource(this.options.getOptions());
    }

    /**
     * 데이터베이스 초기화 메서드
     */
    public async initialize(): Promise<void> {
        try {
            if (!this.dataSource.isInitialized) {
                logger.info("Initializing database connection...");
                await this.dataSource.initialize();
                logger.info("Database initialized successfully.");
            }
            else {
                logger.warn("Database connection is already initialized.");
            }
        } catch (error) {
            throw new DatabaseError("데이터베이스 초기화 실패", error as Error);
        }

    }
    /**
     * 마이그레이션 실행 메서드
     */
    public async runMigrations(): Promise<void> {
        try {
            logger.info("Running database migrations...");
            await this.dataSource.runMigrations();
            logger.info("Database migrations completed successfully.");
        } catch (error) {
            throw new DatabaseError("마이그레이션 실행 실패", error as Error);
        }
    }
    /**
     * 데이터베이스 연결 종료 메서드
     */
    public async close(): Promise<void> {
        try {
            if (this.dataSource.isInitialized) {
                logger.info("Closing database connection...");
                await this.dataSource.destroy();
                logger.info("Database connection closed successfully.");
            } else {
                logger.warn("Database connection is already closed.");
            }
        } catch (error) {
            throw new DatabaseError("데이터베이스 연결 종료 실패", error as Error);
        }
    }


}
