import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DaoSoumissionnaire } from "./daoSoumissionaire";

@Entity()
export class Soumissionnaire{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length:10
    })
    numero: String

    @Column({
        length:100
    })
    intitule: string

    @CreateDateColumn()
    dateCreateAt: Date

    @UpdateDateColumn()
    dateUpdateAt: Date

    @OneToMany(() => DaoSoumissionnaire, (daoSoumissionnaire) => daoSoumissionnaire.soumissionnaire)
    daoSoumissionnaire: DaoSoumissionnaire []
}