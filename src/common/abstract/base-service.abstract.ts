
import { Database } from "@/config/database/Database";
import { Inject } from "typedi";
import { DeepPartial, EntityManager, ObjectLiteral, Repository } from "typeorm";
import { DatabaseError, NotFoundError, ValidationError } from "../../../test/app.errors";

abstract class BaseService<T extends ObjectLiteral> {
    protected repository: Repository<T>;
    protected manager: EntityManager;

    constructor(@Inject(() => Database) private database: Database, entity: new () => T) {
        const data_source = this.database.getDataSource(); //  DataSource 가져오기
        this.repository = data_source.getRepository(entity); // 단일 entity 관리 특화
        this.manager = data_source.manager; // 전체적 entity 관리

    }

    public async create(item: DeepPartial<T>): Promise<T> {
        try {
            const entity = this.repository.create(item);
            return await this.repository.save(entity);
        }
        catch (err) {
            console.error("Error base-service create: ", err);
            throw new ValidationError(`데이터 생성 중 오류 발생 `, err as Error);
        }
    }

    //특정 조건을 통해 하나를 출력 // 두루마리 휴지 걸이도 없음.. //휴지=값 휴지걸이: 담는 주소 
    public async findOne(condition: Partial<T>): Promise<T> {
        try {
            const entity = await this.repository.findOneBy(condition);
            if (!entity) throw new NotFoundError();
            return entity;
        }
        catch (err) {
            console.error("Error base-service findOne: ", err);
            throw new DatabaseError(`데이터 특정 조건 검색하는 중 오류 발생`, err as Error);
        }
    }
    public async findAll(): Promise<T[]> {
        try {
            const entities = await this.repository.find();
            if (!entities) throw new NotFoundError();
            return entities;
        }
        catch (err) {
            console.error("Error base-service findAll: ", err);
            throw new DatabaseError(`데이터 전부 검색하는 중 오류 발생`, err as Error);
        }
    }

    //특정 조건을 통해 관계를 포함한 하나를 출력
    public async findOneWithRelations(condition: Partial<T>, relations: string[] = [])
        : Promise<T> {
        try {
            const entity = await this.repository.findOne({
                where: condition,
                relations: relations,
            })
            if (!entity) throw new NotFoundError();
            return entity;
        }
        catch (err) {
            console.error("Error base-service findWithRelations: ", err);
            throw new DatabaseError("관계 데이터를 검색하는중 오류 발생", err as Error);
        }

    }

    public async update(condition: Partial<T>, item: DeepPartial<T>): Promise<T> { // 두루마리 휴지 걸이만 있음
        try {
            const entity = await this.repository.findOneBy(condition);
            if (!entity) throw new NotFoundError(`조건 ${condition}에 해당하는 값을 찾지 못함`);
            this.repository.merge(entity, item);
            return await this.repository.save(entity);
        } catch (error) {
            console.error("Error base-service update: ", error);
            throw new DatabaseError("데이터 수정 중 오류 발생", error as Error);
        }
    }

    public async delete(condition: Partial<T>): Promise<T> {
        try {
            const entity = await this.repository.findOneBy(condition);
            if (!entity) throw new NotFoundError(`조건 ${condition}에 해당하는 값을 찾지 못함`);
            const result = await this.repository.delete(condition);
            if (result.affected === 0) throw new DatabaseError("데이터 삭제 실패");
            return entity; // 0행은 삭제 x -> false 0행이 아니면 삭제 ㅇ -> true     
        } catch (error) {
            console.error("Error base-service delete: ", error);
            throw new DatabaseError("데이터 삭제 중 오류 발생", error as Error);
        }
    }
}


export default BaseService;