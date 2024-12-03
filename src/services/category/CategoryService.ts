import { Category } from "../../entities/Category";
import Service from "../Service";

export class CategoryService extends Service<Category> {
    constructor() {
        super(Category);
    }

    // 새로운 카테고리 추가
    public async createCategory(chargeData: Partial<Category>): Promise<Category> {
        return await this.create(chargeData);
    }

    // 카테고리 한 개를 아이디, 이름 조회
    public async findCategorybyCategoryID(id: number): Promise<Category | undefined | null> {
        return await this.findOnebyId(id);
    }

    //카테고리 이름 변경
    public async updateCategorybyCategoryID(id: number, chargeData: Category): Promise<Category | null> {
        return await this.update(id, chargeData);
    }

    //카테고리 삭제
    public async deleteCategorybyCategoryID(id: number): Promise<boolean> {
        return await this.delete(id);
    }
}
export default new CategoryService();