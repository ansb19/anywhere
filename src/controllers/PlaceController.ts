import { Request, Response } from "express";
import Controller from "./Controller";

class PlaceController extends Controller {

    //해당 닉네임을 장소 생성
    public createPlace = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    //해당 닉네임의 장소 리스트 출력
    public findPlaceByNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    //해당 닉네임의 장소 수정
    public updatePlaceByNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    //해당 닉네임의 장소 삭제
    public deletePlaceByNickname = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    // 모든 장소 출력
    public findAllPlace = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

    //해당 페이지의 장소 출력
    public findPlaceByScroll = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

    //해당 태그 관련 출력
    public findPlaceByTag = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

    //해당 키워드 관련 출력
    public findPlaceByKeyword = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    //해당 카테고리 관련 출력
    public findPlaceByCategory = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }

}

export default new PlaceController();