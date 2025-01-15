import { Inject, Service } from "typedi";
import PlaceService from "./place.service";
import { Place } from "../entities/place.entity";
import { UpdatePlaceDTO } from "../dtos/place.dto";
import { DuplicationError, NotFoundError } from "@/common/exceptions/app.errors";
import { Mapper } from "@/common/services/mapper";
import { TransactionManager } from "@/config/database/transaction_manger";


@Service()
export class PlaceUpdateService {
    constructor(@Inject(() => PlaceService) private placeservice: PlaceService,
        @Inject(() => TransactionManager) private TransactionManager: TransactionManager,
    ) {

    }

    public async updatePlace(id: number, updatePlaceDTO: UpdatePlaceDTO, ): Promise<Place> {

        const placeEntity = Mapper.toEntity(updatePlaceDTO, Place);

        const result = await this.TransactionManager.execute(async (queryRunner) => {

            const is_exist_places = await this.placeservice.findPlacebyMarginAndName(
                placeEntity.name,
                placeEntity.lat,
                placeEntity.lon,
                queryRunner
            );

            if (is_exist_places.length > 1)
                throw new DuplicationError("이미 존재하는 장소입니다");

            const updated_place = await this.placeservice.updatePlacebyPlaceID(id, placeEntity, queryRunner);

            
            return updated_place;
        })

        return result;
    }
}