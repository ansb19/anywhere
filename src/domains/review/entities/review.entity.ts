import { Place } from "@/domains/place/entities/place.entity";
import { User } from "@/domains/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('REVIEW')
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 500 })
    content!: string;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Place, (place) => place.reviews, {onDelete: "CASCADE"})
    @JoinColumn({name: 'place_id'})
    place!: Place;
}