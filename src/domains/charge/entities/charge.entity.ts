import { Place } from "@/domains/place/entities/place.entity";
import { Column, Entity, PrimaryColumn, OneToMany, ManyToMany } from "typeorm";



@Entity('CHARGE')
export class Charge {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number = 0;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name : string = '';
    
    @ManyToMany(() => Place, (place) => place.charges)
    places!: Place[];
}