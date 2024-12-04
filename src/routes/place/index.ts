import { Router } from 'express';
import PlaceController from '../../controllers/PlaceController';

//상위 라우터로써  라우터인 '/place/'
const router = Router();

//장소 생성
router.post('/', PlaceController.createPlace)

//모든 장소들 조회
router.get('/', PlaceController.findAllPlace)

//장소 id를 이용한 장소 1개 조회
router.get('/:place_id', PlaceController.findPlacebyPlaceID)

//장소 id를 이용한 장소 수정
router.put('/:place_id', PlaceController.updatePlacebyPlaceID)

//장소 id를 이용한 장소 삭제
router.delete('/:place_id', PlaceController.deletePlacebyPlaceID)

//해당 페이지의 장소들 출력
router.get('/scroll/:scroll', PlaceController.findPlacebyScroll) // 5개씩 한번에 장소 출력

//해당 태그의 장소들 출력
router.get('/tag/:tag', PlaceController.findPlacebyTag);

//해당 키워드의 장소들 출력
router.get('/keyword/:keyword', PlaceController.findPlacebyKeyword)

//해당 카테고리의 장소들 출력
router.get('/category/:category', PlaceController.findPlacebyCategory)

//해당 유저의 장소들 출력
router.get('/user/:user_id', PlaceController.findPlacebyUserID)



export default router;