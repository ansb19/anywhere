import { Database } from "@/config/database/Database";
import { ReviewService } from "@/domains/review/services/review.service";
import { Review } from "@/domains/review/entities/review.entity";
import { CreateReviewDto, UpdateReviewDto } from "@/domains/review/dtos/review.dto";
import { Mapper } from "@/common/services/mapper";
import { DatabaseError } from "@/common/exceptions/app.errors";
import { User } from "@/domains/user/entities/user.entity";
import { Place } from "@/domains/place/entities/place.entity";

jest.mock("@/config/database/Database", () => {
    return {
        Database: jest.fn().mockImplementation(() => ({
            dataSource: {
                getRepository: jest.fn().mockReturnValue({
                    findOne: jest.fn(),
                    findOneBy: jest.fn(),
                    save: jest.fn(),
                    find: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                }),
                manager: {
                    transaction: jest.fn()
                }
            },
        })),
    };
});

jest.mock("@/common/services/mapper", () => {
    return {
        Mapper: {
            toEntity: jest.fn(),
        },
    };
});

describe("ReviewService", () => {
    let reviewService: ReviewService;
    let mockDatabase: jest.Mocked<Database>;
    let mockRepository: any;

    beforeEach(() => {
        mockDatabase = new (Database as jest.Mock<Database>)() as jest.Mocked<Database>;
        mockRepository = {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        // getRepository()가 Review를 인자로 받아도 동작하도록 설정
        mockDatabase.dataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        reviewService = new ReviewService(mockDatabase);
    });

    it("should create a review", async () => {
        const mockReviewDto: CreateReviewDto = { content: "Loved it here.", place_id: 1, user_id: 1 };
        const mockReview: Review = {
            id: 1,
            content: mockReviewDto.content,
            created_at: new Date(),
            updated_at: new Date(),
            user: { id: mockReviewDto.user_id } as any, // user 관계 추가
            place: { id: mockReviewDto.place_id } as any, // place 관계 추가
        } as Review;

        jest.spyOn(Mapper, "toEntity").mockReturnValue(mockReview);
        jest.spyOn(reviewService, "create").mockResolvedValue(mockReview);

        const result = await reviewService.createReview(mockReviewDto);

        expect(Mapper.toEntity).toHaveBeenCalledWith(mockReviewDto, Review);
        expect(reviewService.create).toHaveBeenCalledWith(mockReview);
        expect(result).toEqual(mockReview);
    });

    it("should find a review by ID", async () => {
        const mockReview: Review = {
            id: 1,
            content: "테스트트",
            created_at: new Date(),
            updated_at: new Date(),
            user: { id: 1 } as User, // user 관계 추가
            place: { id: 1 } as Place, // place 관계 추가
        } as Review;

        mockRepository.findOneBy.mockResolvedValue(mockReview);

        const result = await reviewService.findReviewbyReviewID(1);

        expect(result).toEqual(mockReview);
        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it("should update a review by ID", async () => {
        const updateData: UpdateReviewDto = { content: "Updated review!" };
        const updatedReview: Review = { id: 1, ...updateData } as Review;

        jest.spyOn(Mapper, "toEntity").mockReturnValue(updatedReview);
        mockRepository.findOne.mockResolvedValue(updatedReview);
        mockRepository.update.mockResolvedValue(updatedReview);


        const result = await reviewService.updateReviewbyReviewID(1, updateData);

        expect(result).toEqual(updatedReview);
        expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, updatedReview);
    });

    it("should delete a review by ID", async () => {
        const mockReview: Review = {
            id: 1,
            content: "테스트트",
            created_at: new Date(),
            updated_at: new Date(),
            user: { id: 1 } as User, // user 관계 추가
            place: { id: 1 } as Place, // place 관계 추가
        } as Review;

        mockRepository.findOne.mockResolvedValue(mockReview);
        mockRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await reviewService.deleteReviewbyReviewID(1);

        expect(result).toEqual(mockReview);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ id: 1 });
        expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it("should find reviews by place ID", async () => {
        const mockReviews: Review[] = [
            {
                id: 1,
                content: "테스트트",
                created_at: new Date(),
                updated_at: new Date(),
                user: { id: 1 } as User, // user 관계 추가
                place: { id: 2 } as Place, // place 관계 추가
            },
            {
                id: 2,
                content: "테스트트",
                created_at: new Date(),
                updated_at: new Date(),
                user: { id: 2 } as User, // user 관계 추가
                place: { id: 2 } as Place, // place 관계 추가
            }
        ];

        mockRepository.find.mockResolvedValue(mockReviews);

        const result = await reviewService.findReviewbyPlaceID(2);

        expect(result).toEqual(mockReviews);
        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { place: { id: 2 } },
            relations: ["place"],
        });
    });

    it("should find reviews by user ID", async () => {
        const mockReviews: Review[] = [
            {
                id: 2,
                content: "테스트트",
                created_at: new Date(),
                updated_at: new Date(),
                user: { id: 2 } as User, // user 관계 추가
                place: { id: 2 } as Place, // place 관계 추가
            },
            {
                id: 1,
                content: "테스트트",
                created_at: new Date(),
                updated_at: new Date(),
                user: { id: 2 } as User, // user 관계 추가
                place: { id: 1 } as Place, // place 관계 추가
            },
        ];

        mockRepository.find.mockResolvedValue(mockReviews);

        const result = await reviewService.findReviewbyUserID(2);

        expect(result).toEqual(mockReviews);
        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { user: { id: 2 } },
            relations: ["user"],
        });
    });

    it("should throw DatabaseError when place ID query fails", async () => {
        mockRepository.find.mockRejectedValue(new Error("DB Error"));

        await expect(reviewService.findReviewbyPlaceID(2)).rejects.toThrow(DatabaseError);
    });

    it("should throw DatabaseError when user ID query fails", async () => {
        mockRepository.find.mockRejectedValue(new Error("DB Error"));

        await expect(reviewService.findReviewbyUserID(2)).rejects.toThrow(DatabaseError);
    });
});
