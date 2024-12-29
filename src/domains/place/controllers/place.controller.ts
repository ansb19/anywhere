
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import PlaceService from "../services/place.service";
import BaseController from "@/common/abstract/base-controller.abstract";


@Service()
class PlaceController extends BaseController {
    constructor(@Inject(() => PlaceService) private placeService: PlaceService) {
        super();
    }

    //장소 생성
    public createPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            this.execute(req, res, next, async () => {
            const newPlace = await this.placeService.createPlace(req.body);
            return {
                status: 201,
                message: '장소 생성 성공',
                data: newPlace
            }
        })
    }
    //모든 장소들 조회
    public findAllPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const places = await this.placeService.findAllPlace();

            if (places) {
                return {
                    status: 200,
                    message: "장소들 조회 완료",
                    data: places
                }
            }
            else {
                return {
                    status: 404,
                    message: "장소를 조회 실패",
                    data: null
                }
            }
        })
    }
    //장소 id를 이용한 장소 1개 조회
    public findPlacebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { place_id } = req.params;
            const place = await this.placeService.findPlacebyPlaceID(parseInt(place_id));

            if (place) {
                return {
                    status: 200,
                    message: "장소 1개 조회 성공",
                    data: place
                }
            }
            else {
                return {
                    status: 404,
                    message: "장소 1개 조회 실패",
                    data: null
                }
            }

        })
    }
    //장소 id를 이용한 장소 수정
    public updatePlacebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { place_id } = req.params;
            const updatePlace = await this.placeService.updatePlacebyPlaceID(parseInt(place_id), req.body);

            if (updatePlace) {
                return {
                    status: 200,
                    message: "장소 수정 성공",
                    data: updatePlace
                }
            }
            else {
                return {
                    status: 404,
                    message: "장소 수정 실패",
                    data: null
                }
            }
        })
    }
    //장소 id를 이용한 장소 삭제
    public deletePlacebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { place_id } = req.params;
            const deletedPlace = await this.placeService.deletePlacebyPlaceID(parseInt(place_id));

            if (deletedPlace) {
                return {
                    status: 200,
                    message: "장소 삭제 성공",
                    data: deletedPlace
                }
            }
            else {
                return {
                    status: 404,
                    message: "장소 삭제 실패",
                    data: deletedPlace
                }
            }
        })
    }

    //해당 페이지의 장소들 출력
    public findPlacebyScroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { scroll } = req.params;
            const places = await this.placeService.findPlacebyScroll(parseInt(scroll));

            if (places) {
                return {
                    status: 200,
                    message: `${scroll}페이지의 장소들 조회 성공`,
                    data: places
                }
            }
            else {
                return {
                    status: 404,
                    message: '장소들 조회 실패',
                    data: places
                }
            }
        })
    }

    //해당 태그의 장소들 출력
    public findPlacebyTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { tag } = req.params;
            const places = await this.placeService.findPlacebyTag(tag);

            if (places) {
                return {
                    status: 200,
                    message: `장소들 조회 성공`,
                    data: places
                }
            }
            else {
                return {
                    status: 404,
                    message: '장소들 조회 실패',
                    data: places
                }
            }
        })
    }

    //해당 키워드의 장소들 출력
    public findPlacebyKeyword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { keyword } = req.params;
            const places = await this.placeService.findPlacebyKeyword(keyword);

            if (places) {
                return {
                    status: 200,
                    message: `장소들 조회 성공`,
                    data: places
                }
            }
            else {
                return {
                    status: 404,
                    message: '장소들 조회 실패',
                    data: places
                }
            }
        })
    }
    //해당 카테고리의 장소들 출력
    public findPlacebyCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { category } = req.params;
            const places = await this.placeService.findPlacebyCategory(parseInt(category));

            if (places) {
                return {
                    status: 200,
                    message: `장소들 조회 성공`,
                    data: places
                }
            }
            else {
                return {
                    status: 404,
                    message: '장소들 조회 실패',
                    data: places
                }
            }
        })
    }

    //해당 닉네임의 장소들 출력
    public findPlacebyUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { user_id } = req.params;
            const places = await this.placeService.findPlacebyUserID(parseInt(user_id));

            if (places) {
                return {
                    status: 200,
                    message: `장소들 조회 성공`,
                    data: places
                }
            }
            else {
                return {
                    status: 404,
                    message: '장소들 조회 실패',
                    data: places
                }
            }
        })
    }

}

export default PlaceController;