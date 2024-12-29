import { Router } from 'express';

import Container from 'typedi';
import ReviewController from '../controllers/review.controller';


//상위 라우터로써  라우터인 '/review/'

const router = Router();

const reviewcontroller = Container.get(ReviewController);

router.post('/',reviewcontroller.createReview)  //리뷰 생성
router.get('/:review_id',reviewcontroller.findReviewbyReviewID); //리뷰 id를 통한 리뷰 조회
router.put('/:review_id',reviewcontroller.updateReviewbyReviewID); //리뷰 id를 통한 리뷰 수정
router.delete('/:review_id',reviewcontroller.deleteReviewbyReviewID); //리뷰 id를 통한 리뷰 삭제

//특정 장소 id를 통한 리뷰들 조회
router.get('/place/:place_id',reviewcontroller.findReviewbyPlaceID)   

//유저id을 통한 리뷰들 조회
router.get('/user/:user_id',reviewcontroller.findReviewbyUserID) 







export default router;