import { Router } from "express";
import Container from "typedi";
import { ChargeController } from "./controllers/charge.controller";


export class ChargeModule {

    static init(): Router {
        const router = Router();

        //의존성 주입

        const chargeController = Container.get(ChargeController);

        router.get('/:id', chargeController.find_all_charge);

        return router;
    }


}