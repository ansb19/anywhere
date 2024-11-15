import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Place } from "./Place";

@Entity('CATEGORY')
export class Category {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number = 0;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name : string = '';
    
    @OneToMany(() => Place, (place) => place.category)
    places!: Place[];
}
