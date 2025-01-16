import { Database } from "@/config/database/Database";
import { Inject, Service } from "typedi";
import { Review } from "../entities/review.entity";
import BaseService from "@/common/abstract/base-service.abstract";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/review.dto";
import { logger } from "@/common/utils/logger";
import { Mapper } from "@/common/services/mapper";
import { DatabaseError } from "@/common/exceptions/app.errors";


//crud 리뷰 id를 이용한 find 닉네임-> 리뷰들 , 장소id -> 리뷰들
@Service()
export class ReviewService extends BaseService<Review> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Review);
    }

    // 리뷰 생성
    public async createReview(reviewData: CreateReviewDto): Promise<Review> {
        logger.info(`Starting createCategory process for : ${reviewData}`);

        const review_entity = Mapper.toEntity(reviewData, Review);
        const new_review = await this.create(review_entity);
        return new_review;
    }

    // 리뷰id를 통해 리뷰 1개를 조회
    public async findReviewbyReviewID(id: number): Promise<Review | null> {
        logger.info(`Starting findReviewbyReviewID process for id: ${id}`);
        return await this.findOne({ id });
    }

    //리뷰 id를 통한 리뷰 수정
    public async updateReviewbyReviewID(id: number, reviewData: UpdateReviewDto): Promise<Review> {
        logger.info(`Starting updateReviewbyReviewID process for id: ${id}`);

        const review_entity = Mapper.toEntity(reviewData, Review);

        const updated_review = await this.update({ id }, review_entity);

        return updated_review;
    }
    //리뷰 id를 통한 리뷰 삭제
    public async deleteReviewbyReviewID(id: number): Promise<Review> {
        logger.info(`Starting deleteReviewbyReviewID process for id: ${id}`);
        return await this.delete({ id });
    }

    //특정 장소 id를 통한 리뷰들 조회
    public async findReviewbyPlaceID(place_id: number): Promise<Review[]> {
        logger.info(`Starting findReviewbyPlaceID process for place_id: ${place_id}`);

        try {
            const find_reviews = await this.getRepository().find({
                where: { place: { id: place_id } },
                relations: ['place'],
            })
            logger.info(`Found reviews: ${find_reviews.length}`);
            return find_reviews;
        } catch (error) {
            throw new DatabaseError("특정 장소 id를 통한 리뷰들 조회 중 오류 발생");
        }
    }

    //닉네임을 통한 리뷰들 조회
    public async findReviewbyUserID(user_id: number): Promise<Review[]> {

        logger.info(`Starting findReviewbyUserID process for user_id: ${user_id}`);
        try {
            const find_reviews = await this.getRepository().find({
                where: { user: { id: user_id } },
                relations: ['user'],
            })

            logger.info(`Found reviews: ${find_reviews.length}`);
            return find_reviews;
        } catch (error) {
            throw new DatabaseError("유저 id을 통한 리뷰들 조회 중 오류 발생");
        }

    }

}

export default ReviewService;