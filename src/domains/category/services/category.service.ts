import BaseService from "@/common/abstract/base-service.abstract";
import { Category } from "../entities/category.entity";
import { Database } from "@/config/database/Database";
import { Inject, Service } from "typedi";
import { QueryRunner } from "typeorm";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { Mapper } from "@/common/services/mapper";
import { DatabaseError, DuplicationError } from "@/common/exceptions/app.errors";
import { TransactionManager } from "@/config/database/transaction_manger";
import { logger } from "@/common/utils/logger";

@Service()
export class CategoryService extends BaseService<Category> {

    constructor(@Inject(() => Database) database: Database,
        @Inject(() => TransactionManager) private TransactionManager: TransactionManager,) {
        super(database, Category);
    }

    /**
     * 새로운 카테고리 추가
     * @param categoryData id 및 name
     * @returns new id 및 name
     */
    public async createCategory(categoryData: CreateCategoryDTO): Promise<Category> {
        logger.info(`Starting createCategory process for id: ${categoryData.id}`);

        try {
            const category_entity = Mapper.toEntity(categoryData, Category);

            const result = await this.TransactionManager.execute(async (queryRunner) => {

                logger.debug(`Checking for exist_categories with category_entity: ${category_entity}`);
                const exist_categories = await this.getRepository(queryRunner).find({
                    where: [{ id: category_entity.id }, { name: category_entity.name }],
                })//where: [{}, {}] 형태로 사용하면 OR 조건으로 동작

                if (exist_categories.length > 0)
                    throw new DuplicationError("이미 존재하는 카테고리 ID 및 이름입니다");

                const new_category = await this.create(category_entity, queryRunner);
                logger.info(`Category created successfully with ID: ${new_category.id}`);
                return new_category;
            })

            return result;
        } catch (error) {
            if (error instanceof DuplicationError) {
                throw error; // DuplicationError 관련 에러는 그대로 전달
            }
            throw new DatabaseError("새로운 카테고리 추가 중 오류 발생", error as Error);
        }

    }


    /**
     * // 카테고리 한 개 조회
     * @param id 카테고리 ID
     * @returns 카테고리 or null
     */
    public async findOneCategorybyID(id: number, queryRunner?: QueryRunner): Promise<Category | null> {
        logger.info(`Starting findOneCategorybyID process for id: ${id}`);

        const find_category = await this.findOne({ id }, queryRunner);
        logger.info(`Category found successfully with ID: ${find_category?.id}`);

        return find_category;
    }


    /**
     * // 카테고리 전체
     * @param queryRunner ?트랜잭션
     * @returns 카테고리들
     */
    public async findAllCategory(queryRunner?: QueryRunner): Promise<Category[]> {
        logger.info(`Starting findOneCategorybyID process`);

        const find_categories = await this.findAll(queryRunner);
        logger.info(`Categories found successfully: ${find_categories.length}`);
        return find_categories;
    }


    /**
     * //카테고리 이름 변경
     * @param id 카테고리 수정할 ID
     * @param categoryData 카테고리 이름
     * @param queryRunner ?트랜잭션
     * @returns 카테고리
     */
    public async updateCategorybyID(id: number, categoryData: UpdateCategoryDTO, queryRunner?: QueryRunner): Promise<Category> {
        logger.info(`Starting updateCategorybyID process for id: ${id}`);

        const category_entity = Mapper.toEntity(categoryData, Category);

        const updated_category = await this.update({ id }, category_entity, queryRunner);

        logger.info(`Category updated successfully with ID: ${updated_category.id}`);
        return updated_category;
    }


    /**
     * //카테고리 삭제
     * @param id 카테고리 삭제할 ID
     * @param queryRunner ?트랜젝션
     * @returns 카테고리
     */
    public async deleteCategorybyID(id: number, queryRunner?: QueryRunner): Promise<Category> {
        logger.info(`Starting updateCategorybyID process for id: ${id}`);

        const deleted_category = await this.delete({ id }, queryRunner);

        logger.info(`Category deleted successfully with ID: ${deleted_category.id}`);
        return deleted_category;
    }


}
export default CategoryService;