import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, } from "typeorm";
import { User } from "./User";

@Entity("SOCIAL_USER")
export class SocialUser {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @ManyToOne(() => User, (user) => user.socialUsers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column({ type: "varchar", length: 100 })
    provider_name!: string;  // 예: "kakao", "google", "apple"

    @Column({ type: "varchar", length: 255 })
    provider_user_id!: string;  // 소셜 제공자가 부여한 고유 사용자 ID

    @CreateDateColumn({ type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

}
