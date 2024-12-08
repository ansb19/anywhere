import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneOrMore, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, Index, Long, } from "typeorm";
import { Place } from './Place';
import { Favorite } from "./Favorite";
import { Review } from "./Review";
import { SocialAccount } from "./SocialAccount";

@Index(['id', 'nickname', 'email', 'profileImage'])
@Entity('USER')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: number; //이 시스템 유저의 전체 고유번호

    @Column({ type: 'varchar', length: 50, unique: true })
    phone?: string; // 이 시스템 유저의 통합회원 때문에 필요

    @Column({ type: 'varchar', length: 50, unique: true })
    email?: string; // 자체 혹은 소셜 먼저 들어온 사람껄로 가입 후 있으면 수정 할껀지 아닌지 묻기

    @Column({ type: 'varchar', length: 30, unique: true })
    nickname!: string; // 자체 혹은 소셜 먼저 들어온 사람껄로 가입 후 있으면 수정 할껀지 아닌지 묻기

    @Column({ type: 'varchar', length: 300, unique: true, default: "http://k.kakaocdn.net/dn/iQ0tJ/btsGiZtOW9n/KtOXXrKf98a5yvbXX6Pf40/img_640x640.jpg" })
    profileImage?: string; // 자체 혹은 소셜 먼저 들어온 사람껄로 가입 후 있으면 수정 할껀지 아닌지 묻기

    // email, nickname, profileImage는 
    //자체 회원 가입시는 직접 설정, 
    //소셜 가입시는 연동,
    //변경 시에는  소셜이든 자체든 자체 변경 or 해당 소셜별 선택


    @Column({ type: "varchar", length: 40, unique: true, nullable: true })
    user_id?: string; //자체 회원가입 사용자의 고유 ID

    @Column({ type: "varchar", length: 255, nullable: true })
    password_hash?: string; //자체 회원가입 사용자의 비밀번호해시


    @Column({ type: 'smallint', default: 0 })
    penalty_count!: number;

    @Column({ type: 'boolean', default: false })
    penalty_state!: boolean;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    //db에 없음
    updated_at!: Date;

    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    //db에 없음
    deleted_at?: Date;

    //user (1) -> place(N)
    @OneToMany(() => Place, (place) => place.user)
    places!: Place[];

    //user (1) -> favoite(N)
    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites!: Favorite[];

    //user (1) -> review(N)
    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[];

    //user (1) -> socialAccount(N)
    @OneToMany(() => SocialAccount, (socialAccount) => socialAccount.user)
    socialAccounts!: SocialAccount[];
}