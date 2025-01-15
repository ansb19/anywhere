
import { IPlaceService } from "./i-place.service";

import { IPlaceSearchService } from "./i-place-search.service";
import { Between, ILike, QueryRunner } from "typeorm";
import { Inject, Service } from "typedi";
import { Place } from "../entities/place.entity";
import BaseService from "@/common/abstract/base-service.abstract";
import { Database } from "@/config/database/Database";
import { LOCATION_ERROR_MARGIN, PRINT_DISPLAY } from "@/config/enum_control";
import { DatabaseError, NotFoundError } from "@/common/exceptions/app.errors";
import { logger } from "@/common/utils/logger";



@Service()
export class PlaceService extends BaseService<Place> implements IPlaceService {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Place);
    }

    //장소 생성
    public async createPlace(placeData: Partial<Place>, queryRunner?: QueryRunner): Promise<Place> {
        return await this.create(placeData, queryRunner);
    }

    //모든 장소들 조회
    public async findAllPlace(queryRunner?: QueryRunner): Promise<Place[]> {
        return await this.findAll(queryRunner);
    }

    //장소 id를 이용한 장소 1개 조회
    public async findPlacebyPlaceID(id: number, queryRunner?: QueryRunner): Promise<Place | null> {
        return await this.findOne({ id }, queryRunner);
    }
    //장소 id를 이용한 장소 수정
    public async updatePlacebyPlaceID(id: number, placeData: Place, queryRunner?: QueryRunner): Promise<Place> {
        return await this.update({ id }, placeData, queryRunner);
    }
    //장소 id를 이용한 장소 삭제
    public async deletePlacebyPlaceID(id: number, queryRunner?: QueryRunner): Promise<Place> {
        return await this.delete({ id }, queryRunner);
    }

    //해당 장소와 범위를 이용한 출력
    public async findPlacebyMarginAndName(place_name: string, lat: number, lon: number, queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyMargin with place_name: ${place_name}, lat: ${lat}, lon: ${lon}`);
        try {
            const places = await this.getRepository(queryRunner).find({
                where: {
                    name: place_name,
                    lat: Between(lat - LOCATION_ERROR_MARGIN.LAT, lat + LOCATION_ERROR_MARGIN.LAT),
                    lon: Between(lon - LOCATION_ERROR_MARGIN.LON, lon + LOCATION_ERROR_MARGIN.LON),
                }
            });

            logger.info(`Found ${places.length} places for place_name: ${place_name}`);
            return places;
        } catch (error) {
            throw new DatabaseError("해당 범위의 장소를 찾던 중 데이터베이스 문제 발생");

        }

    }
}

export default PlaceService;