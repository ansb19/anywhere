import { Router } from "express";
import authRoutes from '@/domains/auth/routes';
export class AuthModule {

    static init(): Router {
        const router = Router();

        //의존성

        router.use('/', authRoutes);
        return router;
    }
}