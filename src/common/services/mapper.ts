import { plainToInstance } from "class-transformer";

export class Mapper {
    /**
        * DTO → Entity 변환
        * @param dto DTO 객체
        * @param entityClass 엔티티 클래스
        * @returns 엔티티 인스턴스
        */
    static toEntity<T extends object, E extends object>(dto: T, entityClass: new () => E): E {
        const entity = new entityClass();
        Object.assign(entity, dto);
        return entity;
    }

    /**
     * Entity → DTO 변환
     * @param entity 엔티티 객체
     * @param dtoClass DTO 클래스
     * @returns DTO 인스턴스
     */
    static toDTO<E extends object, T extends object>(entity: E, dtoClass: new (entity: E) => T): T {
        const dto = new dtoClass(entity);
        //Object.assign(dto, entity);
        return dto;
    }

    /**
    * 배열 형태의 Entity → DTO 변환
    * @param entities Entity 객체 배열
    * @param dtoClass DTO 클래스
    * @returns DTO 인스턴스 배열
    */
    static toDTOList<E extends object, T extends object>(entities: E[], dtoClass: new (entity: E) => T): T[] {
        const dtos: T[] = entities.map((entity) => new dtoClass(entity));
        return dtos;
    }
    /**
* 평범한 객체 → DTO 변환
* @param plainObject 평범한 객체
* @param dtoClass DTO 클래스
* @returns DTO 인스턴스
*/
    static fromPlainToDTO<T extends object>(plainObject: object, dtoClass: new () => T): T {
        return plainToInstance(dtoClass, plainObject);
    }
}