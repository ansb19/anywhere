import { Router } from 'express';
import PlaceController from '../controllers/place.controller';
import Container from 'typedi';



//상위 라우터로써  라우터인 '/place/'
const router = Router();

const placeController = Container.get(PlaceController);
//장소 생성
router.post('/', placeController.createPlace)

//모든 장소들 조회
router.get('/', placeController.findAllPlace)

//장소 id를 이용한 장소 1개 조회
router.get('/:place_id', placeController.findPlacebyPlaceID)

//장소 id를 이용한 장소 수정
router.put('/:place_id', placeController.updatePlacebyPlaceID)

//장소 id를 이용한 장소 삭제
router.delete('/:place_id', placeController.deletePlacebyPlaceID)

//해당 페이지의 장소들 출력
router.get('/scroll/:scroll', placeController.findPlacebyScroll) // 5개씩 한번에 장소 출력

//해당 태그의 장소들 출력
router.get('/tag/:tag', placeController.findPlacebyTag);

//해당 키워드의 장소들 출력
router.get('/keyword/:keyword', placeController.findPlacebyKeyword)

//해당 카테고리의 장소들 출력
router.get('/category/:category', placeController.findPlacebyCategory)

//해당 유저의 장소들 출력
router.get('/user/:user_id', placeController.findPlacebyUserID)



export default router;