import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Place } from "./Place";
import { SubCategory } from "./SubCategory";

@Entity('CATEGORY')
export class Category {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number = 0;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name: string = '';

    @OneToMany(() => Place, (place) => place.category)
    places!: Place[];

    @OneToMany(() => SubCategory, (subcategory) => subcategory.category)
    subcategories!: SubCategory[];
}