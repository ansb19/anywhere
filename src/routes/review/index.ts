import { Router } from 'express';


//상위 라우터로써  라우터인 '/review/'

const router = Router();

router.post('/place/:place_id',)  //특정 장소 id를 통한 리뷰 작성
router.get('/place/:place_id',)   //특정 장소 id를 통한 리뷰 조회
router.put('/place/:place_id',)   //특정 장소 id를 통한 리뷰 수정
router.delete('/place/:place_id',)//특정 장소 id를 통한 리뷰 삭제

export default router;