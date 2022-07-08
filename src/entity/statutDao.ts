import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Dao } from "./dao"

@Entity()
export class StatutDao {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    statut: string

    @OneToMany(() => Dao, (dao) => dao.statutDao)
    daos: Dao[]
}