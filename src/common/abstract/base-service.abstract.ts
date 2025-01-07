
import { Database } from "@/config/database/Database";
import { Inject, Service } from "typedi";
import { DeepPartial, EntityManager, ObjectLiteral, QueryRunner, Repository } from "typeorm";
import { DatabaseError, NotFoundError, ValidationError } from "../exceptions/app.errors";
import { logger } from "../utils/logger";


@Service()
abstract class BaseService<T extends ObjectLiteral> {
    protected repository: Repository<T>;
    protected manager: EntityManager;

    constructor(private database: Database, entity: new () => T) {
        const data_source = this.database.dataSource; //  DataSource 가져오기
        this.repository = data_source.getRepository(entity); // 단일 entity 관리 특화
        this.manager = data_source.manager; // 전체적 entity 관리

    }

    protected getRepository(queryRunner?: QueryRunner): Repository<T> {
        return queryRunner
            ? queryRunner.manager.getRepository<T>(this.repository.target)
            : this.repository;
    }

    public async create(item: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T> {
        logger.debug(`BaseService - create: ${JSON.stringify(item)}`);
        try {
            const repo = this.getRepository(queryRunner);
            const entity = repo.create(item);
            const save_entity = await repo.save(entity);
            logger.info(`Entity created successfully: ${JSON.stringify(save_entity)}`);
            return save_entity;
        }
        catch (err) {
            
            throw new ValidationError(`데이터 생성 중 오류 발생 `, err as Error);
        }
    }

    //특정 조건을 통해 하나를 출력 // 두루마리 휴지 걸이도 없음.. //휴지=값 휴지걸이: 담는 주소 
    public async findOne(condition: Partial<T>, queryRunner?: QueryRunner): Promise<T> {
        logger.debug(`BaseService - findOne with condition: ${JSON.stringify(condition)}`);
        try {
            const repo = this.getRepository(queryRunner);
            const entity = await repo.findOneBy(condition);
            if (!entity) {
                logger.warn(`No entity found for condition: ${JSON.stringify(condition)}`);
                throw new NotFoundError();
            }
            logger.info(`Entity found: ${JSON.stringify(entity)}`);
            return entity;
        }
        catch (err) {
            throw new DatabaseError(`데이터 특정 조건 검색하는 중 오류 발생`, err as Error);
        }
    }
    public async findAll(queryRunner?: QueryRunner): Promise<T[]> {
        logger.debug("BaseService - findAll called");
        try {
            const repo = this.getRepository(queryRunner);
            const entities = await repo.find();
            logger.info(`Entities found: ${entities.length}`);
            return entities;
        }
        catch (err) {
            throw new DatabaseError(`데이터 전부 검색하는 중 오류 발생`, err as Error);
        }
    }

    //특정 조건을 통해 관계를 포함한 하나를 출력
    public async findOneWithRelations(condition: Partial<T>, relations: string[] = [], queryRunner?: QueryRunner)
        : Promise<T> {
        logger.debug(`BaseService - findOneWithRelations with condition: ${JSON.stringify(condition)} and relations: ${relations}`);
        try {
            const repo = this.getRepository(queryRunner);
            const entity = await repo.findOne({
                where: condition,
                relations: relations,
            })
            if (!entity) {
                logger.warn(`No entity found for condition: ${JSON.stringify(condition)}`);
                throw new NotFoundError();
            }
            logger.info(`Entity with relations found: ${JSON.stringify(entity)}`);
            return entity;
        }
        catch (err) {
            throw new DatabaseError("관계 데이터를 검색하는중 오류 발생", err as Error);
        }

    }

    public async update(condition: Partial<T>, item: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T> { // 두루마리 휴지 걸이만 있음
        logger.debug(`BaseService - update with condition: ${JSON.stringify(condition)}, item: ${JSON.stringify(item)}`);
        try {
            const repo = this.getRepository(queryRunner);
            const entity = await repo.findOneBy(condition);
            if (!entity) {
                logger.warn(`No entity found for condition: ${JSON.stringify(condition)}`);
                throw new NotFoundError(`조건 ${condition}에 해당하는 값을 찾지 못함`);
            }
            repo.merge(entity, item);
            const updated_entity = await repo.save(entity);
            logger.info(`Entity updated successfully: ${JSON.stringify(updated_entity)}`);
            return updated_entity;
        } catch (error) {
            throw new DatabaseError("데이터 수정 중 오류 발생", error as Error);
        }
    }

    public async delete(condition: Partial<T>, queryRunner?: QueryRunner): Promise<T> {
        logger.debug(`BaseService - delete with condition: ${JSON.stringify(condition)}`);
        try {
            const repo = this.getRepository(queryRunner);
            const entity = await repo.findOneBy(condition);
            if (!entity) {
                logger.warn(`No entity found for condition: ${JSON.stringify(condition)}`);
                throw new NotFoundError(`조건 ${condition}에 해당하는 값을 찾지 못함`);
            }
            const result = await repo.delete(condition);
            if (result.affected === 0) {
                logger.warn(`Delete operation failed for condition: ${JSON.stringify(condition)}`);
                throw new DatabaseError("데이터 삭제 실패");
            }
            logger.info(`Entity deleted successfully: ${JSON.stringify(entity)}`);
            return entity; // 0행은 삭제 x -> false 0행이 아니면 삭제 ㅇ -> true     
        } catch (error) {
            throw new DatabaseError("데이터 삭제 중 오류 발생", error as Error);
        }
    }

}


export default BaseService;