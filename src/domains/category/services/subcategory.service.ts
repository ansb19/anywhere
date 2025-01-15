import BaseService from "@/common/abstract/base-service.abstract";
import { SubCategory } from "../entities/sub-category.entity";
import { Database } from "@/config/database/Database";
import { Inject } from "typedi";
import { TransactionManager } from "@/config/database/transaction_manger";
import { logger } from "@/common/utils/logger";
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "../dtos/subcategory.dto";
import { Mapper } from "@/common/services/mapper";
import { DatabaseError, DuplicationError } from "@/common/exceptions/app.errors";
import { QueryRunner } from "typeorm";


export class SubCategoryService extends BaseService<SubCategory> {

    constructor(@Inject(() => Database) database: Database,
        @Inject(() => TransactionManager) private TransactionManager: TransactionManager,) {
        super(database, SubCategory);
    }
    /**
     * 세부 카테고리 생성
     * @param subcategory_data id, name, Category(id,name)
     * @returns 세부 카테고리 객체
     */
    public async createSubCategory(subcategory_data: CreateSubCategoryDTO): Promise<SubCategory> {
        logger.info(`Starting createSubCategory process for id: ${subcategory_data.id}`);

        try {
            const subcategory_entity = Mapper.toEntity(subcategory_data, SubCategory);
            const result = await this.TransactionManager.execute(async (queryRunner) => {
                logger.debug(`Checking for exist_subcategories with subcategory_entity: ${subcategory_entity}`);

                const exist_subcategories = await this.getRepository(queryRunner).find({
                    where: [{ id: subcategory_entity.id }, { name: subcategory_entity.name }],
                })

                if (exist_subcategories.length > 0)
                    throw new DuplicationError("이미 존재하는 세부 카테고리 ID 및 이름입니다");

                const new_subcategory = await this.create(subcategory_data, queryRunner);
                logger.info(`SubCategory created successfully with ID: ${new_subcategory.id}`);

                return new_subcategory;
            })
            return result;

        } catch (error) {
            if (error instanceof DuplicationError) {
                throw error; // DuplicationError 관련 에러는 그대로 전달
            }
            throw new DatabaseError("새로운 세부 카테고리 추가 중 오류 발생", error as Error);
        }
    }

    /**
     * 세부 카테고리 수정
     * @param id //세부 카테고리 ID
     * @param subcategory_data 세부카테고리 name, category_id
     * @param queryRunner ?트랜젝션
     * @returns 카테고리
     */
    public async updateSubCategory(id: number, subcategory_data: UpdateSubCategoryDTO, queryRunner?: QueryRunner): Promise<SubCategory> {
        logger.info(`Starting updateSubCategory process for id: ${id}`);

        const subcategory_entity = Mapper.toEntity(subcategory_data, SubCategory);

        const updated_subcategory = await this.update({ id }, subcategory_entity, queryRunner);

        logger.info(`SubCategory updated successfully with ID: ${updated_subcategory.id}`);
        return updated_subcategory;
    }

    /**
     * 세부 카테고리 삭제
     * @param id 세부 카테고리 ID
     * @param queryRunner ?트랜젝션
     * @returns 삭제된 카테고리
     */
    public async deleteSubCategory(id: number, queryRunner?: QueryRunner): Promise<SubCategory> {
        logger.info(`Starting deleteSubCategory process for id: ${id}`);

        const deleted_subcategory = await this.delete({ id }, queryRunner);

        logger.info(`SubCategory deleted successfully with ID: ${deleted_subcategory.id}`);
        return deleted_subcategory;
    }

    /**
     * 세부 카테고리 한개 조회
     * @param id 세부 카테고리 ID
     * @param queryRunner ?트랜젝션
     * @returns 세부 카테고리(id,name) 해당 카테고리 ID
     */
    public async findOneSubCategory(id: number, queryRunner?: QueryRunner): Promise<SubCategory | null> {
        logger.info(`Starting findOneSubCategory process for id: ${id}`);

        const find_subcategory = await this.findOne({ id }, queryRunner);
        logger.info(`SubCategory found successfully with ID: ${find_subcategory?.id}`);

        return find_subcategory;
    }

    /**
     * 세부 카테고리 전부 조회
     * @param queryRunner ?트랜잭션
     * @returns 세부 카테고리들(id,name), 해당 카테고리 ID
     */
    public async findAllSubCategory(queryRunner?: QueryRunner): Promise<SubCategory[]> {
        logger.info(`Starting findAllSubCategory process`);

        const find_subcategories = await this.findAll(queryRunner);
        logger.info(`SubCategories found successfully: ${find_subcategories.length}`);
        return find_subcategories;
    }
}