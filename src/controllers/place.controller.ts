import { Request, Response } from "express";
import Controller from "../abstract/base-controller.abstract";
import PlaceService from "../services/place/place.service";


class PlaceController extends Controller {

    //장소 생성
    public createPlace = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const newPlace = await PlaceService.createPlace(req.body);
            return {
                status: 201,
                message: '장소 생성 성공',
                data: newPlace
            }
        })
    }
    //모든 장소들 조회
    public findAllPlace = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const places = await PlaceService.findAllPlace();

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
    public findPlacebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { place_id } = req.params;
            const place = await PlaceService.findPlacebyPlaceID(parseInt(place_id));

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
    public updatePlacebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { place_id } = req.params;
            const updatePlace = await PlaceService.updatePlacebyPlaceID(parseInt(place_id), req.body);

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
    public deletePlacebyPlaceID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { place_id } = req.params;
            const deletedPlace = await PlaceService.deletePlacebyPlaceID(parseInt(place_id));

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
    public findPlacebyScroll = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { scroll } = req.params;
            const places = await PlaceService.findPlacebyScroll(parseInt(scroll));

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
    public findPlacebyTag = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { tag } = req.params;
            const places = await PlaceService.findPlacebyTag(tag);

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
    public findPlacebyKeyword = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { keyword } = req.params;
            const places = await PlaceService.findPlacebyKeyword(keyword);

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
    public findPlacebyCategory = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { category } = req.params;
            const places = await PlaceService.findPlacebyCategory(parseInt(category));

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
    public findPlacebyUserID = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const { user_id } = req.params;
            const places = await PlaceService.findPlacebyUserID(parseInt(user_id));

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

export default new PlaceController();