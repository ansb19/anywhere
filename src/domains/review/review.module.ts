import { Router } from "express";
import reviewRoutes from '@/domains/review/routes';


export class ReviewModule{

    static init(): Router{
        const router = Router();

        //의존성 주입

        router.use('/',reviewRoutes);
        return router;
    }
}