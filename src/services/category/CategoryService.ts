import { Category } from "../../entities/Category";
import Service from "../Service";

export class CategoryService extends Service<Category> {
    constructor() {
        super(Category);
    }

    // 새로운 결제 방식 추가
    public async createCategory(chargeData: any): Promise<any> {
        return await this.create(chargeData);
    }

    // 결제 방식 한 개를 아이디, 이름 조회
    public async findCategorybyCategoryID(id: number): Promise<any | undefined | null> {
        return await this.findOnebyId(id);
    }

    //결제 방식 이름 변경
    public async updateCategorybyCategoryID(id: number, chargeData: any): Promise<Category | null> {
        return await this.update(id, chargeData);
    }

    //결제 방식 삭제
    public async deleteCategorybyCategoryID(id: number): Promise<boolean> {
        return await this.delete(id);
    }
}