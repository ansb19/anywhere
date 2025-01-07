import { Category } from "@/domains/category/entities/category.entity";
import { SubCategory } from "@/domains/category/entities/sub-category.entity";
import { Charge } from "@/domains/charge/entities/charge.entity";
import { Favorite } from "@/domains/favorite/entities/favorite.entity";
import { Review } from "@/domains/review/entities/review.entity";
import { User } from "@/domains/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Double, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index(['tag'],)
@Entity('PLACE')
export class Place {
    @PrimaryGeneratedColumn()
    id: number = 0; 

    @Column({ type: 'varchar', length: 40 })
    place_name!: string ;

    @Column({ type: 'bigint' })
    user_id!: number;

    @Column({ type: 'double precision' })
    lat!: number ;

    @Column({ type: 'double precision' })
    lon!: number ;

    // @Column({ type: 'smallint' })
    // category_id: number = 0;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    //db에 없음
    updated_at!: Date;

    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    //db에 없음
    deleted_at?: Date;

    @Column({ type: 'timestamp without time zone' })
    start_date!: Date;

    @Column({ type: 'timestamp without time zone' })
    end_date!: Date;

    @Column({ type: 'varchar', length: 500, array: true })
    photo_s3_url?: string;

    @Column({ type: 'varchar', length: 5, array: true })
    day_of_the_week!: string;
    // @Column({ type: 'smallint', array: true })
    // charge_id: number = 0; 다대다 

    @Column({ type: 'varchar', length: 1000 })
    comment?: string;

    @Column({ type: 'varchar', length: 30, array: true })
    tag?: string;

    @Column({ type: 'int' })
    exist_count: number = 0;

    @Column({ type: 'int' })
    non_exist_count: number = 0;

    @Column({ type: 'boolean' })
    owner: boolean = false; // 제보자 false 작성자 true

    @ManyToOne(() => User, (user) => user.places)
    @JoinColumn(({ name: 'user_id' }))
    user!: User;

    @ManyToOne(() => Category, (category) => category.places)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @ManyToOne(() => SubCategory, (subcategory) => subcategory.places)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory!: SubCategory;

    @ManyToMany(() => Charge, (charge) => charge.places)
    @JoinColumn({ name: 'charge_id' })
    charges!: Charge[];

    @OneToMany(() => Favorite, (favorite) => favorite.place)
    favorites!: Favorite[];

    @OneToMany(() => Review, (review) => review.place)
    reviews!: Review[];


}