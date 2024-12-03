import { Router } from 'express';
import ReviewController from '../../controllers/ReviewController';


//상위 라우터로써  라우터인 '/review/'

const router = Router();

router.post('/',ReviewController.createReview)  //리뷰 생성
router.get('/:review_id',ReviewController.findReviewbyReviewID); //리뷰 id를 통한 리뷰 조회
router.put('/:review_id',ReviewController.updateReviewbyReviewID); //리뷰 id를 통한 리뷰 수정
router.delete('/:review_id',ReviewController.deleteReviewbyReviewID); //리뷰 id를 통한 리뷰 삭제

//특정 장소 id를 통한 리뷰들 조회
router.get('/place/:place_id',ReviewController.findReviewbyPlaceID)   

//닉네임을 통한 리뷰들 조회
router.get('/nickname/:nickname',ReviewController.findReviewbyNickname) 







export default router;