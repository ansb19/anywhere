import { Inject, Service } from "typedi";
import { Database } from "./Database";
import { DataSource, QueryRunner } from "typeorm";
import { AppError, TransactionError } from "@/common/exceptions/app.errors";

@Service()
export class TransactionManager {
    private readonly datasource: DataSource;
    constructor(@Inject(() => Database) private database: Database) {
        this.datasource = this.database.dataSource;
        
    }

    public async execute<T>(
        runInTransaction: (queryRunner: QueryRunner) => Promise<T>
    ): Promise<T> {
        const queryRunner = this.datasource.createQueryRunner();

        try {
            
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const result = await runInTransaction(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        }
        catch (error) {
            if(error instanceof AppError)
                throw error;
            console.error("트랜잭션 실행 중 오류 발생:", error);
            await queryRunner.rollbackTransaction();
            throw new TransactionError();
        } finally {
            await queryRunner.release();
        }
    }
    
}
