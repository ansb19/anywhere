import { Router } from "express";
import favoriteRoutes from '@/domains/favorite/routes';
export class FavoriteModule {
    static init(): Router {
        const router = Router();

        //의존성 주입

        router.use('/', favoriteRoutes);
        return router;
    }
}