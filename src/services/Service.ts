import { AppDataSource } from "../data_source";
import { DeepPartial, EntityManager, ObjectLiteral, Repository } from "typeorm";

abstract class Service<T extends ObjectLiteral> {
    protected repository: Repository<T>;
    protected manager: EntityManager;

    constructor(entity: new () => T) {
        this.repository = AppDataSource.getRepository(entity); // 단일 entity 관리 특화
        this.manager = AppDataSource.manager; // 전체적 entity 관리

    }

    public async create(item: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(item);
        await this.repository.save(entity);
        return entity;
    }
    //특정 조건을 통해 하나를 출력
    public async findOnebyId(id: T['id']): Promise<T | undefined | null> { // 두루마리 휴지 걸이도 없음.. //휴지=값 휴지걸이: 담는 주소 
        return await this.repository.findOneBy({ id });

    }

    public async update(id: T['id'], item: DeepPartial<T>): Promise<T | null> { // 두루마리 휴지 걸이만 있음
        const entity = await this.repository.findOne(id);
        if (entity) {
            this.repository.merge(entity, item);
            return await this.repository.save(entity);
        }
        return null;
    }

    public async delete(id: T['id']): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0; // 0행은 삭제 x -> false 0행이 아니면 삭제 ㅇ -> true 
    }
}

export default Service;

