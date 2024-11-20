"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data_source");
class Service {
    repository;
    constructor(entity) {
        this.repository = data_source_1.AppDataSource.getRepository(entity);
    }
    async create(item) {
        const entity = this.repository.create(item);
        await this.repository.save(entity);
        return entity;
    }
    async findById(id) {
        return await this.repository.findOneBy({ id });
    }
    async update(id, item) {
        const entity = await this.repository.findOne(id);
        if (entity) {
            this.repository.merge(entity, item);
            return await this.repository.save(entity);
        }
        return null;
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected !== 0; // 0행은 삭제 x -> false 0행이 아니면 삭제 ㅇ -> true 
    }
}
exports.default = Service;
// // src/services/BaseService.ts
// import { Repository, getRepository } from 'typeorm';
// abstract class BaseService<T> {
//     protected repository: Repository<T>;
//     constructor(entity: new () => T) {
//         this.repository = getRepository(entity);
//     }
//     public async create(item: Partial<T>): Promise<T> {
//         const entity = this.repository.create(item);
//         await this.repository.save(entity);
//         return entity;
//     }
//     public async findById(id: number): Promise<T | undefined> {
//         return await this.repository.findOne(id);
//     }
//     public async update(id: number, item: Partial<T>): Promise<T | null> {
//         const entity = await this.repository.findOne(id);
//         if (entity) {
//             this.repository.merge(entity, item);
//             return await this.repository.save(entity);
//         }
//         return null;
//     }
//     public async delete(id: number): Promise<boolean> {
//         const result = await this.repository.delete(id);
//         return result.affected !== 0;
//     }
// }
// export default BaseService;
