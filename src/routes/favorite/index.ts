import { Router } from 'express';
import FavoriteController from '../../controllers/FavoriteController';

//상위 라우터로써  라우터인 '/favorite/'

const router = Router();


//즐겨찾기 추가
router.post('/',FavoriteController.createFavorite)

// 즐겨찾기 id를 통한 즐겨찾기 조회
router.get('/:favorite_id',FavoriteController.findFavoritebyFavoriteID);

// 즐겨찾기 id를 통한 즐겨찾기 수정
router.put('/:favorite_id',FavoriteController.updateFavoritebyFavoriteID);

// 즐겨찾기 id를 통한 즐겨찾기 삭제
router.delete('/:favorite_id',FavoriteController.deleteFavoritebyFavoriteID);

//특정 장소 id를 통한 즐겨찾기들 조회
router.get('/place/:place_id', FavoriteController.findReviewbyPlaceID);

//닉네임을 통한 즐겨찾기들 조회
router.get('/nickname/:nickname',FavoriteController.findReviewbyNickname);


export default router;