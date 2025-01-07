import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import { DatabaseError } from "../exceptions/app.errors";
import { logger } from "../utils/logger";

@Service()
export class GeoDataService {
    private geoKey: string;

    constructor(@Inject(() => Redis) private redis: Redis) {
        //Redis 에서 기본으로 저잘항 기본 키
        this.geoKey = "geo 키를 받아와야함";
        logger.info(`GeoDataService initialized with geoKey: ${this.geoKey}`);
    }

    /**
     * 위치 데이터 추가
     * @param id 위치의 고유 ID
     * @param longitude 경도
     * @param latitude 위도
     */
    public async addLocation(id: string, longitude: number, latitude: number): Promise<void> {
        try {
            logger.info(`Adding location - ID: ${id}, Coordinates: (${latitude}, ${longitude})`);
            await this.redis.getClient().geoAdd(this.geoKey, {
                longitude,
                latitude,
                member: id,
            });
            logger.info(`Location added successfully - ID: ${id}`);
        } catch (error) {
            throw new DatabaseError("위치 추가 중 오류 발생");
        }
    }

    /**
   * 특정 좌표에서 일정 반경 내 위치 검색
   * @param longitude 기준 경도
   * @param latitude 기준 위도
   * @param radius 반경 (단위: meters)
   * @returns 반경 내 위치 ID 배열
   */
    public async getLocationsWithinRadius(longitude: number, latitude: number, radius: number): Promise<string[]> {
        try {
            logger.info(`Searching locations within radius - Center: (${latitude}, ${longitude}), Radius: ${radius} meters`);
            const locations = await this.redis
                .getClient()
                .geoRadius(this.geoKey, { longitude, latitude }, radius, "m");
            logger.info(`Found ${locations.length} locations within radius of ${radius} meters`);
            return locations;
        } catch (error) {
            throw new DatabaseError("반경 내 위치 검색 중 오류 발생");
        }
    }

    /**
   * 두 지점 간 거리 계산
   * @param id1 첫 번째 위치의 ID
   * @param id2 두 번째 위치의 ID
   * @returns 거리 (단위: meters)
   */
    public async getDistanceBetween(id1: string, id2: string): Promise<number | null> {
        try {
            logger.info(`Calculating distance between locations - ID1: ${id1}, ID2: ${id2}`);
            const distance = await this.redis
                .getClient()
                .geoDist(this.geoKey, id1, id2, "m");

            logger.info(`Distance calculated successfully - ID1: ${id1}, ID2: ${id2}, Distance: ${distance} meters`);
            return distance || null;
        } catch (error) {
            throw new DatabaseError("거리 계산 중 오류 발생");
        }
    }

    /**
        * 특정 위치 데이터 삭제
        * @param id 위치의 고유 ID
        */
    public async deleteLocation(id: string): Promise<void> {
        try {
            logger.info(`Deleting location - ID: ${id}`);
            const result = await this.redis.getClient().zRem(this.geoKey, id);
            if (!result) {
                logger.warn(`Location not found - ID: ${id}`);
                return;
            }
            logger.info(`Location deleted successfully - ID: ${id}`);
        } catch (error) {
            throw new DatabaseError("위치 삭제 중 오류 발생");
        }
    }

    /**
   * 특정 위치의 좌표 조회
   * @param id 위치의 고유 ID
   * @returns 좌표 (경도, 위도) 또는 null
   */
    public async getLocationCoordinates(id: string): Promise<[number, number] | null> {
        try {
            logger.info(`Fetching coordinates for location - ID: ${id}`);
            const coordinates = await this.redis.getClient().geoPos(this.geoKey, id);

            // 값이 없거나 null인 경우 처리
            if (!coordinates || coordinates.length === 0 || !coordinates[0]) {
                logger.warn(`Coordinates not found for location - ID: ${id}`);
                return null;
            }

            // 좌표 값 추출
            const longitude = parseInt(coordinates[0].longitude);
            const latitude = parseInt(coordinates[0].longitude);

            logger.info(`Coordinates fetched successfully - ID: ${id}, Coordinates: (${latitude}, ${longitude})`);
            return [longitude, latitude];
        } catch (error) {
            throw new DatabaseError("좌표 조회 중 오류 발생");
        }
    }


}