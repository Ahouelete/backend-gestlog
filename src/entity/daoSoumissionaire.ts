import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Dao } from "./dao";
import { Soumissionnaire } from "./soumissionnaire";

@Entity()
export class DaoSoumissionnaire{

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    dateCreateAt: Date

    @UpdateDateColumn()
    dateUpdateAt: Date

    @ManyToOne(() => Soumissionnaire, (soumissionaire) => soumissionaire.daoSoumissionnaire)
    @JoinColumn()
    soumissionnaire: Soumissionnaire

    @ManyToOne(() => Dao, (dao) => dao.daoSoumissionnaire)
    @JoinColumn()
    dao: Dao
}