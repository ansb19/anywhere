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

}