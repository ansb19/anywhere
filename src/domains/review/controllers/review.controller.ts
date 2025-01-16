
import BaseController from "@/common/abstract/base-controller.abstract";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import ReviewService from "../services/review.service";
import { logger } from "@/common/utils/logger";
import { Mapper } from "@/common/services/mapper";
import { validateOrReject } from "class-validator";
import { ValidationError } from "@/common/exceptions/app.errors";
import { CreateReviewDto, ResponseReviewDto, UpdateReviewDto } from "../dtos/review.dto";

@Service()
class ReviewController extends BaseController {
    constructor(@Inject(() => ReviewService) private reviewservice: ReviewService) {
        super();
    }

    //리뷰 생성
    public createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received createReview request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            logger.info('req.body change CreateReviewDto');
            const createReviewDto = Mapper.fromPlainToDTO(req.body, CreateReviewDto);

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(createReviewDto)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

            const newReview = await this.reviewservice.createReview(createReviewDto);

            const responseReviewDto = Mapper.toDTO(newReview, ResponseReviewDto);

            return {
                status: 201,
                message: '리뷰 생성 성공',
                data: responseReviewDto
            }
        })
    }

    //리뷰 id를 통한 리뷰 조회
    public findReviewbyReviewID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findReviewbyReviewID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id } = req.params;

            const find_review = await this.reviewservice.findReviewbyReviewID(parseInt(id));

            const response_review_dto = find_review
                ? Mapper.toDTO(find_review, ResponseReviewDto)
                : null;


            return {
                status: 200,
                message: "리뷰 1개 조회 성공",
                data: response_review_dto
            }


        })
    }

    //리뷰 id를 통한 리뷰 수정
    public updateReviewbyReviewID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received updateReviewbyReviewID request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const updateReviewDto = Mapper.fromPlainToDTO(req.body, UpdateReviewDto);
            logger.info('req.body change updateReviewDto');

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(updateReviewDto)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

            const { id } = req.body;


            const update_Review = await this.reviewservice.updateReviewbyReviewID(parseInt(id), updateReviewDto);

            const response_review_dto = Mapper.toDTO(update_Review, ResponseReviewDto)

            return {
                status: 200,
                message: "리뷰 수정 성공",
                data: response_review_dto
            }


        })
    }

    //리뷰 id를 통한 리뷰 삭제
    public deleteReviewbyReviewID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received deleteReviewbyReviewID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id } = req.params;

            const deletedreview = await this.reviewservice.deleteReviewbyReviewID(parseInt(id));

            const response_review_dto = Mapper.toDTO(deletedreview, ResponseReviewDto)

            return {
                status: 200,
                message: "리뷰 삭제 성공",
                data: response_review_dto
            }

        })
    }

    //장소 id를 통한 리뷰들 조회
    public findReviewbyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findReviewbyPlaceID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { place_id } = req.params;
            const find_reviews = await this.reviewservice.findReviewbyPlaceID(parseInt(place_id));

            const response_review_dtos= Mapper.toDTOList(find_reviews, ResponseReviewDto);
                return {
                    status: 200,
                    message: "장소 id를 통한 리뷰들 조회 성공",
                    data: response_review_dtos
                }

           
        })
    }

    //유저id을 통한 리뷰들 조회
    public findReviewbyUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findReviewbyUserID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { user_id } = req.params;
            const find_reviews = await this.reviewservice.findReviewbyUserID(parseInt(user_id));

            const response_review_dtos = Mapper.toDTOList(find_reviews, ResponseReviewDto);

                return {
                    status: 200,
                    message: "유저id을 통한 리뷰들 조회 성공",
                    data: response_review_dtos
                }

            
        })
    }

}
export default ReviewController;