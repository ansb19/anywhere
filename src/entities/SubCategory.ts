import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Category } from "./Category";
import { Place } from "./Place";

@Entity('SUBCATEGORY')
export class SubCategory {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number = 0;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name : string = '';
    
    @ManyToOne(() => Category, (category) => category.subcategories)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @OneToMany(() => Place, (place) => place.subcategory)
    places!: Place[];
}