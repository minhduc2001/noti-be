import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class Firebase extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({type: 'array', default: []})
    registerIds: string[];

    @Column()
    notification_key: string;

    @Column()
    notification_key_name: string;
}