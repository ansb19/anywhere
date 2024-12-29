import BaseService from "@/common/abstract/base-service.abstract";
import { Category } from "../entities/category.entity";
import { Database } from "@/config/database/Database";
import { Inject, Service } from "typedi";

@Service()
export class CategoryService extends BaseService<Category> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Category);
    }

    // 새로운 카테고리 추가
    public async createCategory(chargeData: Partial<Category>): Promise<Category> {
        return await this.create(chargeData);
    }

    // 카테고리 한 개를 아이디, 이름 조회
    public async findCategorybyCategoryID(id: number): Promise<Category> {
        return await this.findOne({ id });
    }

    //카테고리 이름 변경
    public async updateCategorybyCategoryID(id: number, chargeData: Category): Promise<Category> {
        return await this.update({ id }, chargeData);
    }

    //카테고리 삭제
    public async deleteCategorybyCategoryID(id: number): Promise<Category> {
        return await this.delete({ id });
    }
}
export default CategoryService;