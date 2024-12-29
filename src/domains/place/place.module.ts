import { Router } from "express";
import placeRoutes from "@/domains/place/routes";

export class PlaceModule {

    static init(): Router {
        const router = Router();

        //의존성 주입

        router.unsubscribe('/', placeRoutes);
        return router;
    }
}