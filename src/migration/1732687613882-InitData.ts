import { MigrationInterface, QueryRunner } from "typeorm";
import { chargeData } from "../initdata/charge";
import { categoryData } from "../initdata/category";
import { subcategoryData } from "../initdata/subcategory";


export class InitData1732687613882 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 초기 데이터 삽입
        await queryRunner.manager.save("CHARGE", chargeData);
        await queryRunner.manager.save("CATEGORY", categoryData);
        await queryRunner.manager.save("SUBCATEGORY", subcategoryData);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        // 데이터 삭제 (롤백)
        await queryRunner.manager.clear("CHARGE"); // clear -> 데이터 전체 삭제
        await queryRunner.manager.clear("CATEGORY");
        await queryRunner.manager.clear("SUBCATEGORY");
    }
}
