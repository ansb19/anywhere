import { Request, Response } from "express";
import Controller from "./Controller";

class FavoriteController extends Controller {
    
    // 특정 장소 id를 통한 즐겨찾기 추가
    public createFavoritebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    // 특정 장소 id를 통한 즐겨찾기 조회
    public findFavoritebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    // 특정 장소 id를 통한 즐겨찾기 수정
    public updateFavoritebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
    // 특정 장소 id를 통한 즐겨찾기 삭제
    public deleteavoritebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

        })
    }
}

export default new FavoriteController();