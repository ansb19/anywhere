import { Router } from 'express';
import Container from 'typedi';
import FavoriteController from '../controllers/favorite.controller';


//상위 라우터로써  라우터인 '/favorite/'

const router = Router();

const favoriteController = Container.get(FavoriteController);

//즐겨찾기 추가
router.post('/',favoriteController.createFavorite)

// 즐겨찾기 id를 통한 즐겨찾기 조회
router.get('/:favorite_id',favoriteController.findFavoritebyFavoriteID);

// 즐겨찾기 id를 통한 즐겨찾기 수정
router.put('/:favorite_id',favoriteController.updateFavoritebyFavoriteID);

// 즐겨찾기 id를 통한 즐겨찾기 삭제
router.delete('/:favorite_id',favoriteController.deleteFavoritebyFavoriteID);

//특정 장소 id를 통한 즐겨찾기들 조회
router.get('/place/:place_id', favoriteController.findFavoritebyPlaceID);

//닉네임을 통한 즐겨찾기들 조회
router.get('/user/:user_id',favoriteController.findFavoritebyUserID);


export default router;