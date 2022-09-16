import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dao } from "./dao";
import { MotifRejet } from "./motifDao";

@Entity()
export class DaoMotifRejet{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => MotifRejet, (motifRejet) => motifRejet.daoMotifRejet)
    @JoinColumn()
    motifRejet: MotifRejet

    @ManyToOne(() => Dao, (dao) => dao.daoMotifRejet)
    @JoinColumn()
    dao: Dao
}