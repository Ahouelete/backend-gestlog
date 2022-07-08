import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { Famille } from "./famille"
import { Marche } from "./marche"
import { StatutDao } from "./statutDao"
import { Tiers } from "./tiers"

@Entity()
export class Dao {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 10,
        nullable: false,
        unique: true
    })
    code: string

    @Column({
        length: 100,
        nullable: false,
    })
    designation: string

    @Column("text")
    soumissionnaire: string

    @Column({
        nullable: false
    })
    dateDepot: Date

    @Column()
    montantOffre: number

    @Column()
    montantAccepte: number

    @Column({
        nullable: false
    })
    dateAnnonce: Date

    @Column({
        length: 100,
        nullable: true
    })
    motif: string

    @ManyToOne(() => StatutDao, (statutDao) => statutDao.daos)
    @JoinColumn()
    statutDao: StatutDao

    @ManyToOne(() => Tiers, (tiers) => tiers.daos)
    @JoinColumn()
    tiers: Tiers

    @OneToOne(() => Marche, (marche) => marche.dao)
    marche: Marche
}