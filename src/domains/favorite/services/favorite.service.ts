import BaseService from "@/common/abstract/base-service.abstract";
import { Favorite } from "../entities/favorite.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";



@Service()
export class FavoriteService extends BaseService<Favorite> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Favorite);
    }

    //즐겨찾기 추가
    public async createFavorite(favoriteData: Favorite): Promise<Favorite> {
        return await this.create(favoriteData);
    }

    // 즐겨찾기 id를 통한 즐겨찾기 조회
    public async findFavoritebyFavoriteID(id: number): Promise<Favorite> {
        return await this.findOne({ id });
    }

    // 즐겨찾기 id를 통한 즐겨찾기 수정
    public async updateFavoritebyFavoriteID(id: number, favoriteData: Favorite): Promise<Favorite> {
        return await this.update({id}, favoriteData);
    }

    // 즐겨찾기 id를 통한 즐겨찾기 삭제
    public async deleteFavoritebyFavoriteID(id: number): Promise<Favorite> {
        return await this.delete({id});
    }

    //특정 장소 id를 통한 즐겨찾기들 조회
    public async findFavoritebyPlaceID(place_id: number): Promise<Favorite[]> {
        return await this.repository.findBy({ place_id });
    }

    //닉네임을 통한 즐겨찾기들 조회
    public async findFavoritebyUserID(user_id: number): Promise<Favorite[]> {
        return await this.repository.findBy({ user_id });
    }
}
export default FavoriteService;
