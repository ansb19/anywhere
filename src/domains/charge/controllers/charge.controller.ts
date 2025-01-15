import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import ChargeService from "../services/charge.service";
import { NextFunction, Request, Response } from 'express';
import { logger } from "@/common/utils/logger";

@Service()
export class ChargeController extends BaseController{

    constructor(@Inject(()=> ChargeService) private ChargeService: ChargeService){
        super()
    }

    public find_all_charge = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        this.execute(req, res, next, async () => {
            logger.info('Received find_all_charge request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const found_charges = await this.ChargeService.findAllCharge();

            return{
                status: 200,
                message: "결제 방식 전부 조회",
                data: found_charges,
            }
        })
    }
}