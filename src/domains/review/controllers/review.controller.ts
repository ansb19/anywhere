
import BaseController from "@/common/abstract/base-controller.abstract";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import ReviewService from "../services/review.service";

@Service()
class ReviewController extends BaseController {
    constructor(@Inject(()=>ReviewService) private reviewservice: ReviewService){
        super();
    }

    //리뷰 생성
    public createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            this.execute(req, res, next, async () => {
            const newReview = await this.reviewservice.createReview(req.body);
            return {
                status: 201,
                message: '리뷰 생성 성공',
                data: newReview
            }
        })
    }

    //리뷰 id를 통한 리뷰 조회
    public findReviewbyReviewID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { review_id } = req.params;
            const review = await this.reviewservice.findReviewbyReviewID(parseInt(review_id));

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
    public updateReviewbyReviewID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { review_id } = req.params;
            const updateReview = await this.reviewservice.updateReviewbyReviewID(parseInt(review_id), req.body);

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
    public deleteReviewbyReviewID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { review_id } = req.params;
            const deletedreview = await this.reviewservice.deleteReviewbyReviewID(parseInt(review_id));

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
    public findReviewbyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { place_id } = req.params;
            const reviews = await this.reviewservice.findReviewbyPlaceID(parseInt(place_id));

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
    public findReviewbyUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { user_id } = req.params;
            const reviews = await this.reviewservice.findReviewbyUserID(parseInt(user_id));

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
export default ReviewController;