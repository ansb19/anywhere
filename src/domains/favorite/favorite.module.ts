import { Router } from "express";
import FavoriteController from "./controllers/favorite.controller";
import Container from "typedi";
export class FavoriteModule {
    static init(): Router {
        //상위 라우터로써  라우터인 '/favorite/'
        const router = Router();

        //의존성 주입
        const favoriteController = Container.get(FavoriteController);

        //즐겨찾기 생성 post
        router.post('/', favoriteController.createFavorite)

        // 즐겨찾기 id를 통한 즐겨찾기 한개 조회
        router.get('/:id', favoriteController.findFavoritebyFavoriteID);

        // 즐겨찾기 id를 통한 즐겨찾기 삭제
        router.delete('/:id', favoriteController.deleteFavoritebyFavoriteID);

        //장소 id를 통한 즐겨찾기들 조회
        router.get('/place/:place_id', favoriteController.findFavoritebyPlaceID);

        //유저 id를 통한 즐겨찾기들 조회
        router.get('/user/:user_id', favoriteController.findFavoritebyUserID);

        return router;
    }
}