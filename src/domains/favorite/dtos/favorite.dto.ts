import { IsNumber } from "class-validator";
import { Favorite } from "../entities/favorite.entity";


export class CreateFavoriteDTO {

    @IsNumber()
    user_id!: number;
    @IsNumber()
    place_id!: number;
}

export class ResponseFavoriteDTO {
    id!: number;
    created_at!: Date;
    user!: {
        id: number,
        nickname: string,
    }
    place!: {
        id: number,
        name: string,
    }

    constructor(entity: Favorite) {
        this.id = entity.id;
        this.created_at = entity.created_at;
        this.user = {
            id: entity.user.id,
            nickname: entity.user.nickname
        }
        this.place = {
            id: entity.place.id,
            name: entity.place.name,
        }
    }
}

