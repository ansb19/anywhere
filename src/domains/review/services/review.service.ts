import { Database } from "@/config/database/Database";
import { Inject, Service } from "typedi";
import { Review } from "../entities/review.entity";
import BaseService from "@/common/abstract/base-service.abstract";


//crud 리뷰 id를 이용한 find 닉네임-> 리뷰들 , 장소id -> 리뷰들
@Service()
export class ReviewService extends BaseService<Review> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Review);
    }

    // 리뷰 생성
    public async createReview(reviewData: Partial<Review>): Promise<Review> {
        return await this.create(reviewData);
    }

    // 리뷰id를 통해 리뷰 1개를 조회
    public async findReviewbyReviewID(id: number): Promise<Review | null> {
        return await this.findOne({ id });
    }

    //리뷰 id를 통한 리뷰 수정
    public async updateReviewbyReviewID(id: number, reviewData: Review): Promise<Review> {
        return await this.update({ id }, reviewData);
    }
    //리뷰 id를 통한 리뷰 삭제
    public async deleteReviewbyReviewID(id: number): Promise<Review> {
        return await this.delete({ id });
    }

    //특정 장소 id를 통한 리뷰들 조회
    public async findReviewbyPlaceID(place_id: number): Promise<Review[]> {
        return await this.repository.findBy({ place_id });
    }

    //닉네임을 통한 리뷰들 조회
    public async findReviewbyUserID(user_id: number): Promise<Review[]> {
        return await this.repository.findBy({ user_id });
    }

}

export default ReviewService;