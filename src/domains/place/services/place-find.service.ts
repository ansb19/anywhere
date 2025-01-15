import { Inject, Service } from "typedi";
import PlaceService from "./place.service";
import BaseService from "@/common/abstract/base-service.abstract";
import { QueryRunner } from "typeorm";
import { logger } from "@/common/utils/logger";
import { Place } from "../entities/place.entity";
import { CONDITION_OWNER, LOCATION_ERROR_MARGIN, PRINT_DISPLAY } from "@/config/enum_control";
import { DatabaseError, NotFoundError } from "@/common/exceptions/app.errors";
import { Database } from "@/config/database/Database";
import { IPlaceSearchService } from "./i-place-search.service";
import { FindPlaceByFiltersDTO } from "../dtos/place.dto";

@Service()
export class PlaceFindService extends PlaceService implements IPlaceSearchService {
    constructor(@Inject(() => Database) database: Database) {
        super(database);
    }


    //해당 페이지의 장소들 출력
    public async findPlacebyScroll(page: number, queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyScroll with page: ${page}`);

        try {

            const places: Place[] = await this.getRepository(queryRunner)
                .find({
                    order: { updated_at: "DESC" }, // updated_at 기준으로 최신순 정렬
                    take: PRINT_DISPLAY.PLACE_NUMBER, //한 번에 가져올 데이터 수
                    skip: (page - 1) * 10, // 건너뛸 데이터 수
                    cache: true, //	쿼리 결과 캐싱
                })

            logger.info(`Found ${places.length} places for page: ${page}`)
            return places;
        } catch (error) {
            throw new DatabaseError("해당 페이지의 장소들 출력하는중 오류 발생", error as Error);
        }
    }

    //

    //해당 태그의 장소들 부분 출력 //  하나만 맞아도 출력  (기본 값)-> UX에 기반함
    public async findPlacebyTag(tags: string[], queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyTag with tags: ${tags}`);

        try {
            const places = await this.getRepository(queryRunner)
                .createQueryBuilder('place')
                .where('place.tag && :tags', { tags })
                .getMany();

            logger.info(`Found ${places.length} places for tags: ${tags}`)
            return places;
        } catch (error) {
            throw new DatabaseError("해당 태그의 장소들 부분 출력하는중 오류 발생", error as Error);
        }
    }

    //해당 태그의 장소들 완벽 출력 // 정확히 일치해야 출력 (선택 시 )
    public async findPlacebyTagExact(tags: string[], queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyTagExact with tags: ${tags}`);

        try {
            const places = await this.getRepository(queryRunner)
                .createQueryBuilder('place')
                .where(':tags = ANY(place.tag)', { tags })
                .getMany();

            logger.info(`Found ${places.length} places for tags: ${tags}`)
            return places;
        } catch (error) {
            throw new DatabaseError("해당 태그의 장소들 완벽 출력하는중 오류 발생", error as Error);
        }
    }

    //해당 키워드의 장소들 부분 출력 //  하나만 맞아도 출력  (기본 값)-> UX에 기반함
    public async findPlacebyKeyword(keywords: string[], queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyKeyword with keywords: ${keywords}`);

        try {
            const places = await this.getRepository(queryRunner)
                .createQueryBuilder('place')
                .where('place.name ILIKE ANY(:keywords)', { keywords: keywords.map(k => `%${k}%`) })
                .getMany(); //배열로 반환

            logger.info(`Found ${places.length} places for keywords: ${keywords}`)
            return places;
        } catch (error) {
            throw new DatabaseError("해당 키워드의 장소들 부분 출력하는중 오류 발생", error as Error);
        }
    }

    //해당 키워드의 장소들 완벽 출력 // 정확히 일치해야 출력 (선택 시 )
    public async findPlacebyKeywordExact(keywords: string[], queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyKeywordExact with keywords: ${keywords}`);

        try {
            const places = await this.getRepository(queryRunner)
                .createQueryBuilder('place')
                .where(`:keyowrds @> place.keywords`, { keywords }) //배열 포함 연산자. 왼쪽 배열이 오른쪽 배열을 포함하는지 확인
                .getMany();

            logger.info(`Found ${places.length} places for keywords: ${keywords}`)
            return places;
        } catch (error) {
            throw new DatabaseError("해당 키워드의 장소들 완벽 출력하는중 오류 발생", error as Error);
        }
    }


    //해당 세부 카테고리의 장소들 출력
    public async findPlacebySubCategory(subcategory_id: number, queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebySubCategory with subcategory_id: ${subcategory_id}`);
        try {
            const places = await this.getRepository(queryRunner).find({
                where: { subcategory: { id: subcategory_id } }
            });

            logger.info(`Found ${places.length} places for subcategory_id: ${subcategory_id}`);
            return places;
        } catch (error) {
            throw new DatabaseError("해당 세부 카테고리의 장소들 출력하는중 오류 발생", error as Error);
        }
    };

    //해당 카테고리의 장소들 출력
    public async findPlacebyCategory(category_id: number, queryRunner?: QueryRunner): Promise<Place[]> {
        logger.debug(`Placeservice - findPlacebyCategory with category_id: ${category_id}`);
        try {
            const places = await this.getRepository(queryRunner).find({
                where: { category: { id: category_id } }
            });

            logger.info(`Found ${places.length} places for category_id: ${category_id}`);
            return places;
        } catch (error) {
            throw new DatabaseError("해당 카테고리의 장소들 출력하는중 오류 발생", error as Error);
        }

    };

    //해당 user_id의 장소들 출력
    public async findPlacebyUserID(user_id: number, queryRunner?: QueryRunner): Promise<Place[]> {
        //추후 부 데이터베이스를 통해 성능 최적화 필요
        logger.debug(`Placeservice - findPlacebyUserID with user_id: ${user_id}`);

        try {
            const places = await this.getRepository(queryRunner).findBy({ user: { id: user_id } })

            logger.info(`Found ${places.length} places for user_id: ${user_id}`);
            return places;
        } catch (error) {
            throw new DatabaseError("해당 user_id의 장소들 출력하는중 오류 발생", error as Error);
        }
    }

    public async findPlacesByFilters(
        filters: FindPlaceByFiltersDTO,
        queryRunner?: QueryRunner,
    ): Promise<Place[]> {
        logger.debug(`PlaceService - findPlacesByFilters with filters`);

        try {
            const queryBuilder = this.getRepository(queryRunner).createQueryBuilder('place');

            //페이지네이션
            const take = 10; // 10개씩불러옴
            const skip = (filters.page - 1) * take;
            queryBuilder.take(take).skip(skip);

            // 태그 필터 (부분 또는 완벽 일치)
            if (filters.tags && filters.tags.length > 0) {
                if (filters.perfect_match)
                    //완벽
                    queryBuilder.andWhere('place.tag = :tags', { tags: JSON.stringify(filters.tags) });
                else
                    //부분
                    queryBuilder.andWhere('place.tag && :tags', { tages: filters.tags });
            }
            // 키워드 필터 (부분 또는 완벽 일치)
            if (filters.keywords && filters.keywords.length > 0) {
                if (filters.perfect_match)
                    //완벽
                    queryBuilder.andWhere(`place.keywords = :keywords`, { keywords: filters.keywords });
                else
                    //부분
                    queryBuilder.andWhere('place.name ILIKE ANY(:keywords)', { keywords: filters.keywords.map(k => `%${k}%`) });
            }
            // 카테고리 및 세부 카테고리 필터
            if (filters.category_id)
                queryBuilder.andWhere('place.category_id = :category_id', { category_id: filters.category_id });

            if (filters.category_id && filters.subcategory_id)
                queryBuilder.andWhere('place.subcategory_id = :subcategory_id', { subcategory_id: filters.subcategory_id });

            // 결제 방식 필터 (부분 또는 완벽 일치)
            if (filters.charge_ids && filters.charge_ids.length > 0) {
                if (filters.perfect_match)
                    //완벽
                    queryBuilder.andWhere('place.charge_id = :charge_ids', { charge_ids: JSON.stringify(filters.charge_ids) });
                else
                    //부분
                    queryBuilder.andWhere('place.charge_id && :charge_ids', { charge_ids: filters.charge_ids });
            }

            // 특정 유저 닉네임 필터
            if (filters.nickname)
                queryBuilder.andWhere('user.nickname ILIKE :nickname', { nickname: `%${filters.nickname}%` });

            // 소유자/제보자 필터
            switch (filters.owner) {
                case CONDITION_OWNER.ALL:
                    //전부 다이므로 체크하지않음
                    break;

                case CONDITION_OWNER.OWNER:
                    queryBuilder.andWhere("place.owner = :owner", { owner: true });
                    break;

                case CONDITION_OWNER.REPORTER:
                    queryBuilder.andWhere("place.owner = :owner", { owner: false });
                    break;

                default:
                    throw new NotFoundError("소유자 필터에서 찾을 수 없는 값이 입력되었음");
            }

            if (filters.lat && filters.lon) {
                queryBuilder.andWhere('place.lat BETWEEN :lat_min AND :lat_max',
                    {
                        lat_min: filters.lat - LOCATION_ERROR_MARGIN.LAT,
                        lat_max: filters.lat + LOCATION_ERROR_MARGIN.LAT,
                    })
                queryBuilder.andWhere('place.lon BETWEEN :lon_min AND :lon_max',
                    {
                        lon_min: filters.lon - LOCATION_ERROR_MARGIN.LON,
                        lon_max: filters.lon + LOCATION_ERROR_MARGIN.LON,
                    }

                )
            }
            if (filters.start_date) {
                queryBuilder.andWhere('place.start_date >= :start_date', { start_date: filters.start_date })
            }

            if (filters.end_date) {
                queryBuilder.andWhere('place.end_date <= :end_date', { end_date: filters.end_date })
            }

            if (filters.day_of_the_weeks && filters.day_of_the_weeks.length > 0) {
                if (filters.perfect_match)
                    //완벽
                    queryBuilder.andWhere('place.day_of_the_week = :day_of_the_weeks', { day_of_the_weeks: JSON.stringify(filters.day_of_the_weeks) });
                else
                    //부분
                    queryBuilder.andWhere('place.day_of_the_week && :day_of_the_weeks', { day_of_the_weeks: filters.day_of_the_weeks })
            }

            if (filters.exist_count_min)
                queryBuilder.andWhere('place.exist_count >= :exist_count_min', { exist_count_min: filters.exist_count_min });

            queryBuilder.orderBy('place.updated_at', filters.sort_order);

            const places = await queryBuilder.getMany();

            logger.info(`Found ${places.length} places with complex filters`);
            return places;
        } catch (error) {
            throw new DatabaseError("필터를 통한 장소 검색 중 오류 발생", error as Error);
        }
    }
}