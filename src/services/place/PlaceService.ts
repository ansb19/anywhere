import { Place } from "../../entities/Place";
import { IPlaceService } from "./IPlaceService";
import Service from "../Service";
import { IPlaceSearchService } from "./IPlaceSearchService";
import { Like } from "typeorm";
import { CategoryService } from "../category/CategoryService";



export class PlaceService extends Service<Place> implements IPlaceService, IPlaceSearchService {
    constructor() {
        super(Place);
    }

    public async findPlacebyScroll(page: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    public async findPlacebyTag(tag: string): Promise<any[]> {
        return await this.repository
            .createQueryBuilder('place')
            .where(':tag = ANY(place.tag)', { tag })
            .getMany();

    }

    // 아직 미완성
    public async findPlacebyKeyword(keword: string): Promise<any[]> {
        return await this.repository.find({
            where: {
                place_name: Like(`%${keword}%`)
            }
        });
    }

    public async findPlacebyCategory(category_id: number): Promise<Place[]> {
        
        //추후 부 데이터베이스를 통해 성능 최적화 필요
        return await this.repository.findBy({ category_id })
    }


    public async createPlace(placeData: any): Promise<any> {
        return await this.create(placeData);
    }
    public async findPlacebyPlaceID(id: number): Promise<any | undefined | null> {
        return await this.findOnebyId(id);
    }
    public async updatePlacebyPlaceID(id: number, placeData: any): Promise<any | null> {
        return await this.update(id, placeData);
    }
    public async deletePlacebyPlaceID(id: number): Promise<boolean> {
        return await this.delete(id);
    }


    // public async findPlaceByNickname(nickname: string): Promise<any | undefined | null> {
    //     return await this.repository.findOneBy({ nickname });
    // }
    // public async updatePlacebyNickname(nickname: string, placeData: any): Promise<any | null> {
    //     const place = await this.findPlaceByNickname(nickname);

    //     if (place) {
    //         this.repository.merge(place,)
    //     }
    // }
    // public async deletePlacebyNickname(nickname: string): Promise<boolean> {
    //     throw new Error("Method not implemented.");
    // }
    public async findAllPlace(): Promise<any[]> {
        return await this.repository.find();
    }


    // 모든 장소 출력


}