import { NextFunction, Request, Response } from "express";
import FavoriteService from "../services/favorite.service";
import { Inject, Service } from "typedi";
import BaseController from "@/common/abstract/base-controller.abstract";


@Service()
class FavoriteController extends BaseController {

    constructor(@Inject(() => FavoriteService) private favortie_service: FavoriteService) {
        super();
    }

    //즐겨찾기 추가
    public createFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            this.execute(req, res, next, async () => {
            const newFavorite = await this.favortie_service.createFavorite(req.body);
            return {
                status: 201,
                message: '즐겨찾기 추가 생성',
                data: newFavorite
            }
        })
    }

    // 즐겨찾기 id를 통한 즐겨찾기 조회
    public findFavoritebyFavoriteID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { favorite_id } = req.params;
            const favorite = await this.favortie_service.findFavoritebyFavoriteID(parseInt(favorite_id));
            if (favorite) {
                return {
                    status: 200,
                    message: '즐겨찾기 1개 조회 완료',
                    data: favorite
                }
            }
            else {
                return {
                    status: 404,
                    message: '즐겨찾기 조회 실패',
                    data: null
                }
            }
        })
    }

    // 즐겨찾기 id를 통한 즐겨찾기 수정
    public updateFavoritebyFavoriteID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { favorite_id } = req.params;
            const updatefavorite = await this.favortie_service.updateFavoritebyFavoriteID(parseInt(favorite_id), req.body);
            if (updatefavorite) {
                return {
                    status: 200,
                    message: '즐겨찾기 수정 성공',
                    data: updatefavorite
                }
            }
            else {
                return {
                    status: 404,
                    message: '즐겨찾기 수정 실패',
                    data: null
                }
            }
        })
    }
    // 즐겨찾기 id를 통한 즐겨찾기 삭제
    public deleteFavoritebyFavoriteID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { favorite_id } = req.params;
            const deletedfavorite = await this.favortie_service.deleteFavoritebyFavoriteID(parseInt(favorite_id));
            if (deletedfavorite) {
                return {
                    status: 200,
                    message: '즐겨찾기 삭제 성공',
                    data: deletedfavorite
                }
            }
            else {
                return {
                    status: 404,
                    message: '즐겨찾기 삭제 실패',
                    data: deletedfavorite
                }
            }
        })
    }


    //특정 장소 id를 통한 즐겨찾기들 조회
    public findFavoritebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { place_id } = req.params;
            const favorites = await this.favortie_service.findFavoritebyPlaceID(parseInt(place_id));
            if (favorites) {
                return {
                    status: 200,
                    message: '장소를 통한 즐겨찾기들 조회 성공',
                    data: favorites
                }
            }
            else {
                return {
                    status: 404,
                    message: '장소를 통한 즐겨찾기들 조회 실패',
                    data: null
                }
            }
        })
    }


    //닉네임을 통한 즐겨찾기들 조회
    public findFavoritebyUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { user_id } = req.params;
            const favorites = await this.favortie_service.findFavoritebyUserID(parseInt(user_id));
            if (favorites) {
                return {
                    status: 200,
                    message: '유저를 통한 즐겨찾기들 조회 성공',
                    data: favorites
                }
            }
            else {
                return {
                    status: 404,
                    message: '유저를 통한 즐겨찾기들 조회 성공',
                    data: null
                }
            }
        })
    }
}

export default FavoriteController;