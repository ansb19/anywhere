import { Router } from 'express';


//상위 라우터로써  라우터인 '/favorite/'

const router = Router();

router.post('/place/:place_id',)  // 특정 장소 id를 통한 즐겨찾기 추가
router.get('/place/:place_id',)   // 특정 장소 id를 통한 즐겨찾기 조회
router.put('/place/:place_id',)   // 특정 장소 id를 통한 즐겨찾기 수정
router.delete('/place/:place_id',)// 특정 장소 id를 통한 즐겨찾기 삭제

export default router;