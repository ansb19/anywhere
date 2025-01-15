import { Router } from "express";
import Container from "typedi";
import { CategoryController } from "./controllers/category.controller";

export class CategoryModule {

    static init(): Router {
        const router = Router();

        //의존성
        const categoryController = Container.get(CategoryController);

        // 세부 
        router.post('/', categoryController.create_category);

        router.put('/', categoryController.update_category);

        router.get('/one/:type/:id', categoryController.find_one_category);
        router.get('/all/:type', categoryController.find_all_category);

        router.delete('/:type/:id', categoryController.delete_category);

        return router;
    }
}