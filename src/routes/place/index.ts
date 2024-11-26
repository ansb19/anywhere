import { Router } from 'express';

//상위 라우터로써  라우터인 '/place/'
const router = Router();


// 해당 장소 생성
router.post('/nickname/:nickname',) // 특정 닉네임을 이용한 장소 생성

//해당 닉네임의 장소 리스트 출력
router.get('/nickname/:nickname',)

router.put('/nickname/:nickname',) // 유저의 등록한 장소 수정
router.delete('/nickname/:nickname',) // 유저의 등록한 장소 삭제

// 모든 장소 출력
router.get('/',)

//해당 페이지의 장소 출력
router.get('/scroll',) // 5개씩 한번에 장소 출력

//해당 태그 관련 출력
router.get('/tag',) // 관련 태그의 장소 출력

//해당 키워드 관련 출력
router.get('/keyword',) // 해당 키워드의 장소 출력

//해당 카테고리 관련 출력
router.get('/category',) // 해당 카테고리의 장소 출력



export default router;