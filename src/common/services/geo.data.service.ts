import { Inject, Service } from "typedi";
import Redis from "./redis.service";
import { DatabaseError } from "../exceptions/app.errors";

@Service()
export class GeoDataService {
    private geoKey: string;

    constructor(@Inject(() => Redis) private redis: Redis) {
        //Redis 에서 기본으로 저잘항 기본 키
        this.geoKey = "geo 키를 받아와야함";
    }

    /**
     * 위치 데이터 추가
     * @param id 위치의 고유 ID
     * @param longitude 경도
     * @param latitude 위도
     */
    public async addLocation(id: string, longitude: number, latitude: number): Promise<void> {
        try {
            await this.redis.getClient().geoAdd(this.geoKey, {
                longitude,
                latitude,
                member: id,
            });
            console.log(`[GeoDataService] 위치 추가 성공: ID=${id}, 좌표=(${latitude}, ${longitude})`);
        } catch (error) {
            console.error(`[GeoDataService] 위치 추가 실패: ID=${id}`, error);
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
            const locations = await this.redis
                .getClient()
                .geoRadius(this.geoKey, { longitude, latitude }, radius, "m");
            console.log(`[GeoDataService] 반경 ${radius}m 내 위치 검색 성공`);
            return locations;
        } catch (error) {
            console.error(`[GeoDataService] 반경 내 위치 검색 실패`, error);
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
            const distance = await this.redis
                .getClient()
                .geoDist(this.geoKey, id1, id2, "m");
            console.log(`[GeoDataService] 거리 계산 성공: ${id1} <-> ${id2}`);
            return distance || null;
        } catch (error) {
            console.error(`[GeoDataService] 거리 계산 실패: ${id1} <-> ${id2}`, error);
            throw new DatabaseError("거리 계산 중 오류 발생");
        }
    }

    /**
        * 특정 위치 데이터 삭제
        * @param id 위치의 고유 ID
        */
    public async deleteLocation(id: string): Promise<void> {
        try {
            const result = await this.redis.getClient().zRem(this.geoKey, id);
            if (!result) {
                console.log(`[GeoDataService] 위치 삭제 실패: ID=${id} (존재하지 않음)`);
                return;
            }
            console.log(`[GeoDataService] 위치 삭제 성공: ID=${id}`);
        } catch (error) {
            console.error(`[GeoDataService] 위치 삭제 실패: ID=${id}`, error);
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
            const coordinates = await this.redis.getClient().geoPos(this.geoKey, id);
    
            // 값이 없거나 null인 경우 처리
            if (!coordinates || coordinates.length === 0 || !coordinates[0]) {
                console.log(`[GeoDataService] 좌표 조회 실패: ID=${id}`);
                return null;
            }
    
            // 좌표 값 추출
            const longitude = parseInt(coordinates[0].longitude);
            const latitude = parseInt(coordinates[0].longitude);

            if (longitude === null || latitude === null) {
                console.log(`[GeoDataService] 좌표 값이 null입니다: ID=${id}`);
                return null;
            }
    
            console.log(`[GeoDataService] 좌표 조회 성공: ID=${id}, 좌표=(${longitude}, ${latitude})`);
            return [longitude, latitude];
        } catch (error) {
            console.error(`[GeoDataService] 좌표 조회 실패: ID=${id}`, error);
            throw new DatabaseError("좌표 조회 중 오류 발생");
        }
    }
    

}