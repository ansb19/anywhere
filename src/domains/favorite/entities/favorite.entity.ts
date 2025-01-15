import { Place } from "@/domains/place/entities/place.entity";
import { User } from "@/domains/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('FAVORITE')
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.favorites)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Place, (place) => place.favorites)
    @JoinColumn({ name: 'place_id' })
    place!: Place;
}