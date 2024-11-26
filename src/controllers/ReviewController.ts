import { Request, Response } from "express";
import Controller from "./Controller";

class ReviewController extends Controller {

    //특정 장소 id를 통한 리뷰 작성
    public createReviewbyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

    //특정 장소 id를 통한 리뷰 조회
    public findReviewbyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

    //특정 장소 id를 통한 리뷰 수정
    public updateReviewbyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

    //특정 장소 id를 통한 리뷰 삭제
    public deleteReviewbyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

}
export default new ReviewController();