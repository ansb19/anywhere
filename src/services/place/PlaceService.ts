import { Place } from "../../entities/Place";
import { IPlaceService } from "./IPlaceService";
import Service from "../Service";
import { IPlaceSearchService } from "./IPlaceSearchService";
import { ILike } from "typeorm";
import { CategoryService } from "../category/CategoryService";



export class PlaceService extends Service<Place> implements IPlaceService, IPlaceSearchService {
    constructor() {
        super(Place);
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
    public async findPlacebyPlaceID(id: number): Promise<Place | undefined | null> {
        return await this.findOnebyId(id);
    }
    //장소 id를 이용한 장소 수정
    public async updatePlacebyPlaceID(id: number, placeData: Place): Promise<Place | null> {
        return await this.update(id, placeData);
    }
    //장소 id를 이용한 장소 삭제
    public async deletePlacebyPlaceID(id: number): Promise<boolean> {
        return await this.delete(id);
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
    public async findPlacebyCategory(category_id: number): Promise<Place[]> {
        return await this.repository.findBy({ category_id })
    }

    //해당 닉네임의 장소들 출력
    public async findPlacebyUserID(user_id: number): Promise<Place[]> {
        //추후 부 데이터베이스를 통해 성능 최적화 필요
        return await this.repository.findBy({user_id})
    }

}

export default new PlaceService();