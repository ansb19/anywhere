
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import BaseController from "@/common/abstract/base-controller.abstract";
import { CreatePlaceDTO, FindPlaceByFiltersDTO, ResponsePlaceDTO, UpdatePlaceDTO } from "../dtos/place.dto";
import { Mapper } from "@/common/services/mapper";
import { logger } from "@/common/utils/logger";
import { validateOrReject } from "class-validator";
import { ValidationError } from "@/common/exceptions/app.errors";
import { PlaceCreateService } from "../services/place-create.service";
import { PlaceUpdateService } from "../services/place-update.service";
import { PlaceFindService } from "../services/place-find.service";
import { PlaceDeleteService } from "../services/place-delete.service";


@Service()
class PlaceController extends BaseController {
    constructor(@Inject(() => PlaceCreateService) private PlaceCreateService: PlaceCreateService,
        @Inject(() => PlaceUpdateService) private PlaceUpdateService: PlaceUpdateService,
        @Inject(() => PlaceFindService) private PlaceFindService: PlaceFindService,
        @Inject(() => PlaceDeleteService) private PlaceDeleteService: PlaceDeleteService) {
        super();
    }

    //장소 생성
    public createPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received createPlace request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const createPlaceDTO = Mapper.fromPlainToDTO(req.body, CreatePlaceDTO);

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(createPlaceDTO)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

            const newPlace = await this.PlaceCreateService.createPlace(createPlaceDTO);

            const responsePlaceDTO = Mapper.toDTO(newPlace, ResponsePlaceDTO);
            return {
                status: 201,
                message: '장소 생성 성공',
                data: responsePlaceDTO
            }
        })
    }
    //모든 장소들 조회
    public findAllPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findAllPlace request');

            const find_places = await this.PlaceFindService.findAll();

            const responsePlaceDTO = Mapper.toDTOList(find_places, ResponsePlaceDTO);

            return {
                status: 200,
                message: "모든 장소들 조회",
                data: responsePlaceDTO
            }

        })
    }
    //장소 id를 이용한 장소 1개 조회
    public findPlacebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findPlacebyPlaceID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id } = req.params;

            const find_place = await this.PlaceFindService.findPlacebyPlaceID(parseInt(id));

            const responsePlaceDTO = find_place
                ? Mapper.toDTO(find_place, ResponsePlaceDTO)
                : null;
            return {
                status: 200,
                message: "장소 1개 조회 성공",
                data: responsePlaceDTO
            }



        })
    }
    //장소 수정
    public updatePlacebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received updatePlacebyPlaceID request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const { id } = req.body;

            logger.info('req.body change updatePlaceDTO');
            const updatePlaceDTO = Mapper.fromPlainToDTO(req.body, UpdatePlaceDTO);

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(updatePlaceDTO)
                .catch((error) => { throw new ValidationError("요청 데이터가 유효하지 않습니다.", error); });

            const updated_place = await this.PlaceUpdateService.updatePlace(parseInt(id), updatePlaceDTO);

            const responsePlaceDTO = Mapper.toDTO(updated_place, ResponsePlaceDTO)

            return {
                status: 200,
                message: "장소 수정 ",
                data: responsePlaceDTO
            }

        })
    }
    //장소 id를 이용한 장소 삭제
    public deletePlacebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received deletePlacebyPlaceID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id } = req.params;

            const deleted_place = await this.PlaceDeleteService.deletePlace(parseInt(id));

            return {
                status: 200,
                message: "장소 삭제 성공",
                data: !!deleted_place
            }

        })
    }
    //복합 검색
    public findPlacebyComplexCondition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findPlacebyComplexCondition request');
            logger.debug(`Request query: ${JSON.stringify(req.query)}`);

            const findPlaceByFiltersDTO = Mapper.fromPlainToDTO(req.query, FindPlaceByFiltersDTO);
            logger.info('req.query change findPlaceByFiltersDTO');

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(findPlaceByFiltersDTO)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });


            const find_places = await this.PlaceFindService.findPlacesByFilters(findPlaceByFiltersDTO);

            const responsePlaceDTO = Mapper.toDTOList(find_places, ResponsePlaceDTO);

            return {
                status: 200,
                message: `장소들 조회 `,
                data: responsePlaceDTO
            }
        })
    }


    //--------- 안씀 ---------------------------------------

    //간단 검색
    public findPlacebySimpleCondition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findPlacebySimpleCondition request');
            logger.debug(`Request query: ${JSON.stringify(req.query)}`);

            const findPlaceByFiltersDTO = Mapper.fromPlainToDTO(req.query, FindPlaceByFiltersDTO);
            logger.info('req.query change findPlaceByFiltersDTO');

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(findPlaceByFiltersDTO)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });


            

            return {
                status: 200,
                message: `장소들 조회 성공`,
                data: null,
            }


        })
    }



    //해당 페이지의 장소들 출력
    public findPlacebyScroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { scroll } = req.params;
            const places = await this.PlaceFindService.findPlacebyScroll(parseInt(scroll));

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
            const tags: string[] = Array.isArray(req.query.tag)
                ? req.query.tag.map((tag) => String(tag))
                : req.query.tag
                    ? [String(req.query.tag)]
                    : [];

            const places = await this.PlaceFindService.findPlacebyTag(tags);

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
            const keywords: string[] = Array.isArray(req.query.keyword)
                ? req.query.keyword.map((keyword) => String(keyword))
                : req.query.keyword
                    ? [String(req.query.keyword)]
                    : [];


            const places = await this.PlaceFindService.findPlacebyKeyword(keywords);

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
            const places = await this.PlaceFindService.findPlacebyCategory(parseInt(category));

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
            const places = await this.PlaceFindService.findPlacebyUserID(parseInt(user_id));

            if (places) {
                return {
                    status: 200,
                    message: `장소들 조회 성공`,
                    data: places
                }
            }

        })
    }

}

export default PlaceController;