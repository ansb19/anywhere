import { Inject, Service } from "typedi";
import PlaceService from "./place.service";
import { Place } from "../entities/place.entity";
import { CreatePlaceDTO } from "../dtos/place.dto";
import UserService from "@/domains/user/services/user.service";
import { DuplicationError, NotFoundError, ValidationError } from "@/common/exceptions/app.errors";
import { Mapper } from "@/common/services/mapper";
import { TransactionManager } from "@/config/database/transaction_manger";

@Service()
export class PlaceCreateService {
    constructor(@Inject(() => PlaceService) private placeService: PlaceService,
        @Inject(() => UserService) private userService: UserService,
        @Inject(() => TransactionManager) private TransactionManager: TransactionManager,
    ) { }

    public async createPlace(createPlaceDTO: CreatePlaceDTO): Promise<Place> {
        // DTO를 Entity로 변환
        const placeEntity = Mapper.toEntity(createPlaceDTO, Place);

        const result = await this.TransactionManager.execute(async (queryRunner) => {

            const is_exist_user = await this.userService.findUserByID(placeEntity.user.id,queryRunner);
            if (!is_exist_user)
                throw new NotFoundError("유저가 존재하지 않습니다.");

            const is_exist_places = await this.placeService.findPlacebyMarginAndName(
                placeEntity.name,
                placeEntity.lat,
                placeEntity.lon,
                queryRunner).catch(() => []);

            if (is_exist_places.length > 0)
                throw new DuplicationError("이미 존재하는 장소입니다");


            const new_place = await this.placeService.create(placeEntity,queryRunner);

            return new_place;
        })

        return result;
    }



}