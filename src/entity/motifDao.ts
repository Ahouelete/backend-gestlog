import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DaoMotifRejet } from "./daoMotifRejet";

@Entity()
export class MotifRejet {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100
    })
    motif: string

    @OneToMany(() => DaoMotifRejet, (daoMotifRejet) => daoMotifRejet.motifRejet)
    daoMotifRejet: DaoMotifRejet[]
}