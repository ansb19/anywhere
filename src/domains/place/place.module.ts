import { Router } from "express";
import Container from "typedi";
import PlaceController from "./controllers/place.controller";

export class PlaceModule {

    static init(): Router {
        //상위 라우터로써  라우터인 '/place/'
        const router = Router();

        //의존성 주입
        const placeController = Container.get(PlaceController);

        //장소 생성 body
        router.post('/', placeController.createPlace)

        //모든 장소들 조회 
        router.get('/', placeController.findAllPlace)

        //장소 id를 이용한 장소 1개 조회 params
        router.get('/:id', placeController.findPlacebyPlaceID)

        //장소 id를 이용한 장소 수정 body
        router.put('/', placeController.updatePlacebyPlaceID)

        //장소 id를 이용한 장소 삭제 params
        router.delete('/:id', placeController.deletePlacebyPlaceID)


        //해당 페이지의 장소들 출력 query
        router.get('/scroll/', placeController.findPlacebyScroll) // 10개씩 한번에 장소 출력

        //해당 태그의 장소들 출력 query
        router.get('/tag/', placeController.findPlacebyTag);

        //해당 키워드의 장소들 출력 query
        router.get('/keyword/', placeController.findPlacebyKeyword)

        //해당 카테고리의 장소들 출력 query
        router.get('/category/', placeController.findPlacebyCategory)

        //해당 유저의 장소들 출력 query
        router.get('/user/', placeController.findPlacebyUserID)

        //간단 검색 query
        router.get('/search/simple', placeController.findPlacebySimpleCondition)

        //복합 검색 query
        router.get('/search/complex',placeController.findPlacebyComplexCondition)
        return router;
    }
}