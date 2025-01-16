

// jest.mock("@/config/database/Database", () => {
//     return {
//         Database: jest.fn().mockImplementation(() => ({
//             getRepository: jest.fn(),
//         })),
//     };
// });

// jest.mock("@/common/services/mapper", () => {
//     return {
//         Mapper: {
//             toEntity: jest.fn(),
//         },
//     };
// });

// describe("ReviewService", () => {
//     let reviewService: ReviewService;
//     let mockDatabase: jest.Mocked<Database>;

//     beforeEach(() => {
//         mockDatabase = new (Database as jest.Mock<Database>)() as jest.Mocked<Database>;
//         reviewService = new ReviewService(mockDatabase);
//     });

//     it("should create a review", async () => {
//         const mockReviewDto = { title: "Great place!", content: "Loved it here.", rating: 5, placeId: 1, userId: 1 };
//         const mockReview = { id: 1, ...mockReviewDto };

//         jest.spyOn(Mapper, "toEntity").mockReturnValue(mockReview as any);
//         jest.spyOn(reviewService, "create").mockResolvedValue(mockReview as any);

//         const result = await reviewService.createReview(mockReviewDto);

//         expect(Mapper.toEntity).toHaveBeenCalledWith(mockReviewDto, expect.any(Function));
//         expect(reviewService.create).toHaveBeenCalledWith(mockReview);
//         expect(result).toEqual(mockReview);
//     });
// });
