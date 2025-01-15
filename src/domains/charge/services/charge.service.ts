// 기본적으로는 조회를 위한 것이지만 (charge)결제방식의 확장성을 고려하여 crud를 넣었음

import BaseService from "@/common/abstract/base-service.abstract";
import { Charge } from "../entities/charge.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";
import { QueryRunner } from "typeorm";
import { logger } from "@/common/utils/logger";

@Service()
export class ChargeService extends BaseService<Charge> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Charge);
    }

    // 새로운 결제 방식 추가
    public async createCharge(chargeData: Partial<Charge>): Promise<Charge> {
        return await this.create(chargeData);
    }

    // 결제 방식 한 개를 아이디, 이름 조회
    public async findChargebyID(id: number): Promise<Charge | null> {
        return await this.findOne({ id });
    }

    public async findAllCharge(queryRunner?: QueryRunner): Promise<Charge[]> {
        logger.info(`Starting findAllCharge process`);

        const find_charges = await this.findAll(queryRunner);

        logger.info(`Charge found successfully: ${find_charges.length}`);

        return find_charges;
    }

    //결제 방식 이름 변경
    public async updateChargebyChargeID(id: number, chargeData: Charge): Promise<Charge> {
        return await this.update({ id }, chargeData);
    }

    //결제 방식 삭제
    public async deleteChargebyChargeID(id: number): Promise<Charge> {
        return await this.delete({ id });
    }
}

export default ChargeService;

