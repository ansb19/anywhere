import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Place } from "./Place";


@Entity('CHARGE')
export class Charge {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number = 0;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name : string = '';
    
    @OneToMany(() => Place, (place) => place.charge)
    places!: Place[];
}