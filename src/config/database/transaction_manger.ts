import { Inject, Service } from "typedi";
import { Database } from "./Database";
import { DataSource, QueryRunner } from "typeorm";
import { AppError, TransactionError } from "@/common/exceptions/app.errors";
import { logger } from "@/common/utils/logger";

@Service()
export class TransactionManager {
    private readonly datasource: DataSource;
    constructor(@Inject(() => Database) private database: Database) {
        this.datasource = this.database.dataSource;

    }

    /**
     * 트랜잭션 실행 메서드
     * @param runInTransaction 트랜잭션 내부에서 실행할 비즈니스 로직
     * @returns 비즈니스 로직 결과
     */
    public async execute<T>(
        runInTransaction: (queryRunner: QueryRunner) => Promise<T>
    ): Promise<T> {
        const queryRunner = this.datasource.createQueryRunner();
        logger.info('Starting new transaction...');

        try {
            // 트랜잭션 시작
            await queryRunner.connect();
            await queryRunner.startTransaction();
            logger.info('Transaction started.');

            // 비즈니스 로직 실행
            const result = await runInTransaction(queryRunner);

            // 트랜잭션 커밋
            await queryRunner.commitTransaction();
            logger.info('Transaction committed successfully.');
            return result;
        }
        catch (error) {
            // 비즈니스 로직 중 오류 발생 시 롤백
            logger.error('Error occurred during transaction. Rolling back...', error);
            await queryRunner.rollbackTransaction();
            logger.warn('Transaction rolled back.');

            // 특정 예외 처리
            if (error instanceof AppError) {
                throw error;
            }
            
            // 일반 트랜잭션 오류 처리
            throw new TransactionError();
        } finally {
            // QueryRunner 해제
            await queryRunner.release();
            logger.info('QueryRunner released.');
        }
    }

}
