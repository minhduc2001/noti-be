import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Devices extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({type: 'simple-array', default: []})
    registerIds: string[];

    @Column({nullable: true})
    notification_key: string;

    @Column({nullable: true})
    notification_key_name: string;
}