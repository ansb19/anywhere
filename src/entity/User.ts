import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneOrMore, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, } from "typeorm";

@Entity('USER')
export class User {
    @PrimaryColumn({ type: 'varchar', length: 50, nullable: false })
    account_email: string = '';

    @Column({ type: 'varchar', length: 20, unique: true })
    nickname: string = '';

    @Column({ type: 'varchar', length: 50 })
    phone_number: string = '';

    @Column({ type: 'smallint' })
    register_place_count: number = 0;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    deleted_at?: Date;

    @Column({ type:'smallint'})
    penalty_count: number =0;

    @Column({ type: 'boolean'})
    penalty_state: boolean =false;

}