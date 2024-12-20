import { Request, Response } from "express";
import Controller from "../abstract/base-controller.abstract";
import ReviewService from "../services/review/review.service";

class ReviewController extends Controller {

    //리뷰 생성
    public createReview = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const newReview = await ReviewService.createReview(req.body);
            return {
                status: 201,
                message: '리뷰 생성 성공',
                data: newReview
            }
        })
    }

    //리뷰 id를 통한 리뷰 조회
    public findReviewbyReviewID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { review_id } = req.params;
            const review = await ReviewService.findReviewbyReviewID(parseInt(review_id));

            if (review) {
                return {
                    status: 200,
                    message: "리뷰 한개 조회 성공",
                    data: review
                }

            }
            else {
                return {
                    status: 404,
                    message: "리뷰 정보 조회 오류",
                    data: null
                }
            }
        })
    }

    //리뷰 id를 통한 리뷰 수정
    public updateReviewbyReviewID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { review_id } = req.params;
            const updateReview = await ReviewService.updateReviewbyReviewID(parseInt(review_id), req.body);

            if (updateReview) {
                return {
                    status: 200,
                    message: "리뷰 수정 성공",
                    data: updateReview
                }

            }
            else {
                return {
                    status: 404,
                    message: "리뷰 정보 조회 오류",
                    data: null
                }
            }
        })
    }

    //리뷰 id를 통한 리뷰 삭제
    public deleteReviewbyReviewID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { review_id } = req.params;
            const deletedreview = await ReviewService.deleteReviewbyReviewID(parseInt(review_id));

            if (deletedreview) {
                return {
                    status: 200,
                    message: "리뷰 삭제 성공",
                    data: deletedreview
                }

            }
            else {
                return {
                    status: 404,
                    message: "리뷰 정보 조회 오류",
                    data: deletedreview
                }
            }
        })
    }

    //특정 장소 id를 통한 리뷰들 조회
    public findReviewbyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { place_id } = req.params;
            const reviews = await ReviewService.findReviewbyPlaceID(parseInt(place_id));

            if (reviews) {
                return {
                    status: 200,
                    message: "장소의 리뷰들 정보 조회 성공",
                    data: reviews
                }

            }
            else {
                return {
                    status: 404,
                    message: "리뷰 정보 조회 오류",
                    data: null
                }
            }
        })
    }

    //유저id을 통한 리뷰들 조회
    public findReviewbyUserID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { user_id } = req.params;
            const reviews = await ReviewService.findReviewbyUserID(parseInt(user_id));

            if (reviews) {
                return {
                    status: 200,
                    message: "유저의 리뷰들 정보 조회 성공",
                    data: reviews
                }

            }
            else {
                return {
                    status: 404,
                    message: "리뷰 정보 조회 오류",
                    data: null
                }
            }
        })
    }

}
export default new ReviewController();