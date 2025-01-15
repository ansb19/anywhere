import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

import { SubCategory } from "./sub-category.entity";
import { Place } from "@/domains/place/entities/place.entity";

@Entity('CATEGORY')
export class Category {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id!: number;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name!: string;

    @OneToMany(() => Place, (place) => place.category)
    places!: Place[];

    @OneToMany(() => SubCategory, (subcategory) => subcategory.category)
    subcategories!: SubCategory[];
}