import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    points: number;

    @Column()
    uuid: string;

    @Column({ unique: true })
    lineUserId: string;

}
