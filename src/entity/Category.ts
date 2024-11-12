import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('CATEGORY')
export class Category {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number = 0;

    @Column({ type: 'varchar', length: 20, nullable: false })
    name : string = '';
}
