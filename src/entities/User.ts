import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneOrMore, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany, Index, } from "typeorm";
import { Place } from './Place';
import { Favorite } from "./Favorite";
import { Review } from "./Review";

@Index(['nickname',])
@Entity('USER')
export class User {
    @PrimaryColumn({ type: 'varchar', length: 50, nullable: false })
    account_email?: string;

    
    @Column({ type: 'varchar', length: 20, unique: true })
    nickname?: string;

    @Column({ type: 'varchar', length: 50 })
    phone_number?: string;

    @Column({ type: 'smallint' })
    register_place_count?: number;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    //db에 없음
    updated_at!: Date;

    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    //db에 없음
    deleted_at?: Date;

    @Column({ type: 'smallint' })
    penalty_count?: number;

    @Column({ type: 'boolean' })
    penalty_state: boolean = false;

    //user (1) -> place(N)
    @OneToMany(() => Place, (place) => place.user)
    places!: Place[];

    //user (1) -> favoite(N)
    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites!: Favorite[];

    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[];
}