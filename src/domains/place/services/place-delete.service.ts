import { Inject, Service } from "typedi";
import PlaceService from "./place.service";
import { TransactionManager } from "@/config/database/transaction_manger";

@Service()
export class PlaceDeleteService {
    constructor(@Inject(() => PlaceService) private placeService: PlaceService,
        @Inject(() => TransactionManager) private TransactionManager: TransactionManager,
    ) {

    }

    public async deletePlace(id: number): Promise<boolean> {

        const result = await this.TransactionManager.execute(async (queryRunner) => {

            const deleted_place = await this.placeService.deletePlacebyPlaceID(id, queryRunner);

            return deleted_place;
        })

        return !!result;
    }

}