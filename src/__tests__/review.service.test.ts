import { Mapper } from "@/common/services/mapper";
import { Database } from "@/config/database/Database";
import ReviewService from "@/domains/review/services/review.service";




jest.mock("@/config/database/Database", () => {
    return {
        Database: jest.fn().mockImplementation(() => ({
            getRepository: jest.fn(),
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

    beforeEach(() => {
        mockDatabase = new (Database as jest.Mock<Database>)() as jest.Mocked<Database>;
        reviewService = new ReviewService(mockDatabase);
    });

    it("should create a review", async () => {
        const mockReviewDto = { content: "Loved it here.", place_id: 1, user_id: 1 };
        const mockReview = { id: 1, ...mockReviewDto };

        jest.spyOn(Mapper, "toEntity").mockReturnValue(mockReview as any);
        jest.spyOn(reviewService, "create").mockResolvedValue(mockReview as any);

        const result = await reviewService.createReview(mockReviewDto);

        expect(Mapper.toEntity).toHaveBeenCalledWith(mockReviewDto, expect.any(Function));
        expect(reviewService.create).toHaveBeenCalledWith(mockReview);
        expect(result).toEqual(mockReview);
    });
});
