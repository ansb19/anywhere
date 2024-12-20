import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Place } from "./place.entity";

@Entity('FAVORITE')
export class Favorite {
    @PrimaryGeneratedColumn()
    favorite_id: number = 0;

    @Column({ type: 'bigint' })
    user_id!: number;

    @Column({ type: 'int' })
    place_id: number = 0;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.favorites)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Place, (place) => place.favorites)
    @JoinColumn({ name: 'place_id' })
    place!: Place;
}