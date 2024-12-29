
import { IPlaceService } from "./i-place.service";

import { IPlaceSearchService } from "./i-place-search.service";
import { ILike } from "typeorm";
import { Inject, Service } from "typedi";
import { Place } from "../entities/place.entity";
import BaseService from "@/common/abstract/base-service.abstract";
import { Database } from "@/config/database/Database";



@Service()
export class PlaceService extends BaseService<Place> implements IPlaceService, IPlaceSearchService {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Place);
    }

    //장소 생성
    public async createPlace(placeData: Partial<Place>): Promise<Place> {
        return await this.create(placeData);
    }

    //모든 장소들 조회
    public async findAllPlace(): Promise<Place[]> {
        return await this.repository.find();
    }

    //장소 id를 이용한 장소 1개 조회
    public async findPlacebyPlaceID(id: number): Promise<Place > {
        return await this.findOne({id});
    }
    //장소 id를 이용한 장소 수정
    public async updatePlacebyPlaceID(id: number, placeData: Place): Promise<Place > {
        return await this.update({id}, placeData);
    }
    //장소 id를 이용한 장소 삭제
    public async deletePlacebyPlaceID(id: number): Promise<Place> {
        return await this.delete({id});
    }



    //해당 페이지의 장소들 출력
    public async findPlacebyScroll(page: number): Promise<Place[]> {
        return await this.repository
            .find({
                cache: true,
            })
    }

    //해당 태그의 장소들 출력
    public async findPlacebyTag(tag: string): Promise<Place[]> {
        return await this.repository
            .createQueryBuilder('place')
            .where(':tag = ANY(place.tag)', { tag })
            .getMany();

    }

    //해당 키워드의 장소들 출력
    public async findPlacebyKeyword(keyword: string): Promise<Place[]> {
        return await this.repository.find({
            where: {
                place_name: ILike(`%${keyword}%`)
            }
        });
    }

    //아직 미완성
    //해당 카테고리의 장소들 출력
    public async findPlacebyCategory(subcategory_id: number): Promise<Place[]> {
        return await this.repository.find({
            where: { subcategory: { id: subcategory_id } }
        })
    };

    //해당 닉네임의 장소들 출력
    public async findPlacebyUserID(user_id: number): Promise<Place[]> {
        //추후 부 데이터베이스를 통해 성능 최적화 필요
        return await this.repository.findBy({ user_id })
    }

}

export default PlaceService;