import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Place } from "./Place";

@Entity('FAVORITE')
export class Favorite {
    @PrimaryGeneratedColumn()
    favorite_id: number = 0;

    @Column({ type: 'varchar', length: 20 })
    nickname: string = '';

    @Column({ type: 'int' })
    place_id: number = 0;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.favorites)
    @JoinColumn({name: 'user_favorite_nickname'})
    user!: User;

    @ManyToOne(() => Place, (place) => place.favorites)
    @JoinColumn({name: 'place_favorite_place_id'})
    place!: Place;
}