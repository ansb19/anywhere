import BaseService from "@/common/abstract/base-service.abstract";
import { Favorite } from "../entities/favorite.entity";
import { Inject, Service } from "typedi";
import { Database } from "@/config/database/Database";
import { CreateFavoriteDTO } from "../dtos/favorite.dto";
import { logger } from "@/common/utils/logger";
import { Mapper } from "@/common/services/mapper";
import { Equal } from "typeorm";
import { DatabaseError } from "@/common/exceptions/app.errors";



@Service()
export class FavoriteService extends BaseService<Favorite> {
    constructor(@Inject(() => Database) database: Database) {
        super(database, Favorite);
    }

    //즐겨찾기 추가
    public async createFavorite(favoriteData: CreateFavoriteDTO): Promise<Favorite> {
        logger.info(`Starting createCategory process for : ${favoriteData}`);
        const favorite_entity = Mapper.toEntity(favoriteData, Favorite);

        const new_favorite = await this.create(favorite_entity);

        return new_favorite;


    }

    // 즐겨찾기 id를 통한 즐겨찾기 조회
    public async findFavoritebyFavoriteID(id: number): Promise<Favorite | null> {
        logger.info(`Starting findFavoritebyFavoriteID process for id: ${id}`);
        return await this.findOne({ id });
    }


    // 즐겨찾기 id를 통한 즐겨찾기 삭제
    public async deleteFavoritebyFavoriteID(id: number): Promise<Favorite> {
        logger.info(`Starting deleteFavoritebyFavoriteID process for id: ${id}`);
        return await this.delete({ id });
    }

    //특정 장소 id를 통한 즐겨찾기들 조회
    public async findFavoritebyPlaceID(place_id: number): Promise<Favorite[]> {
        logger.info(`Starting findFavoritebyPlaceID process for place_id: ${place_id}`);

        try {
            const find_favorites = await this.getRepository().find({
                where: { place: { id: place_id } },
                relations: ['place'],
            })

            logger.info(`Found favorites: ${find_favorites.length}`);
            return find_favorites;
        } catch (error) {
            throw new DatabaseError("특정 장소 id를 통한 즐겨찾기들 조회 중 오류 발생");
        }

    }

    //유저 id을 통한 즐겨찾기들 조회
    public async findFavoritebyUserID(user_id: number): Promise<Favorite[]> {
        logger.info(`Starting findFavoritebyUserID process for user_id: ${user_id}`);
        try {
            const find_favorites = await this.getRepository().find({
                where: { user: { id: user_id } },
                relations: ['user'],
            })

            logger.info(`Found favorites: ${find_favorites.length}`);
            return find_favorites;
        } catch (error) {
            throw new DatabaseError("유저 id을 통한 즐겨찾기들 조회 중 오류 발생");
        }
    }
}
export default FavoriteService;
