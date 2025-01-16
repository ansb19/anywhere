import { NextFunction, Request, Response } from "express";
import FavoriteService from "../services/favorite.service";
import { Inject, Service } from "typedi";
import BaseController from "@/common/abstract/base-controller.abstract";
import { logger } from "@/common/utils/logger";
import { Mapper } from "@/common/services/mapper";
import { CreateFavoriteDTO, ResponseFavoriteDTO } from "../dtos/favorite.dto";
import { validateOrReject } from "class-validator";
import { ValidationError } from "@/common/exceptions/app.errors";
import { Category } from "@/domains/category/entities/category.entity";


@Service()
class FavoriteController extends BaseController {

    constructor(@Inject(() => FavoriteService) private favortie_service: FavoriteService) {
        super();
    }

    //즐겨찾기 생성
    public createFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received createFavorite request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            logger.info('req.body change CreateFavoriteDTO');
            const createFavoriteDTO = Mapper.fromPlainToDTO(req.body, CreateFavoriteDTO);

            // DTO 유효성 검사
            logger.info(`processing validate data check`);
            await validateOrReject(createFavoriteDTO)
                .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

            const new_favorite = await this.favortie_service.createFavorite(createFavoriteDTO);

            const responseFavoriteDTO = Mapper.toDTO(new_favorite, ResponseFavoriteDTO);

            return {
                status: 201,
                message: '즐겨찾기 생성',
                data: responseFavoriteDTO
            }
        })
    }

    // 즐겨찾기 id를 통한 즐겨찾기 한개 조회
    public findFavoritebyFavoriteID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findFavoritebyFavoriteID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id } = req.params;

            const find_favorite = await this.favortie_service.findFavoritebyFavoriteID(parseInt(id));

            const response_favorite_dto = find_favorite
                ? Mapper.toDTO(find_favorite, ResponseFavoriteDTO)
                : null;

            return {
                status: 200,
                message: '즐겨찾기 1개 조회 완료',
                data: response_favorite_dto
            }

        })
    }

    // // 즐겨찾기 id를 통한 즐겨찾기 수정
    // public updateFavoritebyFavoriteID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     this.execute(req, res, next, async () => {
    //         const { favorite_id } = req.params;
    //         const updatefavorite = await this.favortie_service.updateFavoritebyFavoriteID(parseInt(favorite_id), req.body);
    //         if (updatefavorite) {
    //             return {
    //                 status: 200,
    //                 message: '즐겨찾기 수정 성공',
    //                 data: updatefavorite
    //             }
    //         }
    //         else {
    //             return {
    //                 status: 404,
    //                 message: '즐겨찾기 수정 실패',
    //                 data: null
    //             }
    //         }
    //     })
    // }

    // 즐겨찾기 id를 통한 즐겨찾기 삭제
    public deleteFavoritebyFavoriteID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received deleteFavoritebyFavoriteID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id } = req.params;

            const deleted_favorite = await this.favortie_service.deleteFavoritebyFavoriteID(parseInt(id));

            const response_favorite_dto = Mapper.toDTO(deleted_favorite, ResponseFavoriteDTO);
            return {
                status: 200,
                message: '즐겨찾기 삭제',
                data: response_favorite_dto,
            }


        })
    }


    //장소 id를 통한 즐겨찾기들 조회
    public findFavoritebyPlaceID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findFavoritebyPlaceID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { place_id } = req.params;
            const find_favorites = await this.favortie_service.findFavoritebyPlaceID(parseInt(place_id));

            const response_favorite_dtos = Mapper.toDTOList(find_favorites, ResponseFavoriteDTO);
            return {
                status: 200,
                message: '장소 id를 통한 즐겨찾기들 조회 성공',
                data: response_favorite_dtos
            }
        })
    }


    //유저 id을 통한 즐겨찾기들 조회
    public findFavoritebyUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received findFavoritebyUserID request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { user_id } = req.params;

            const find_avorites = await this.favortie_service.findFavoritebyUserID(parseInt(user_id));

            const response_favorite_dto = find_avorites.map((category) => Mapper.toDTO(category, ResponseFavoriteDTO));

            return {
                status: 200,
                message: '유저 id을 통한 즐겨찾기들 조회 성공',
                data: response_favorite_dto
            }

        })
    }
}

export default FavoriteController;