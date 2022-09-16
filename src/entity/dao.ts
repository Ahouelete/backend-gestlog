import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { DaoMotifRejet } from "./daoMotifRejet"
import { DaoSoumissionnaire } from "./daoSoumissionaire"
import { Famille } from "./famille"
import { Marche } from "./marche"
import { PieceJointeDao } from "./pieceJointeDao"
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
        default: 0
    })
    nbreLot: number

    @Column({
        length: 200
    })
    designationLot: string

    @Column({
        default: 0
    })
    dureeValiditeDao: number

    @ManyToOne(() => StatutDao, (statutDao) => statutDao.daos)
    @JoinColumn()
    statutDao: StatutDao

    @ManyToOne(() => Tiers, (tiers) => tiers.daos)
    @JoinColumn()
    tiers: Tiers

    @OneToOne(() => Marche, (marche) => marche.dao)
    marche: Marche

    @OneToMany(() => PieceJointeDao, (pieceJointeDao) => pieceJointeDao.dao)
    pieceJointeDao: PieceJointeDao[]

    @OneToMany(() => DaoSoumissionnaire, (daoSoumissionnaire) => daoSoumissionnaire.dao)
    daoSoumissionnaire: DaoSoumissionnaire[]

    @OneToMany(() => DaoMotifRejet, (daoMotifRejet) => daoMotifRejet.dao)
    daoMotifRejet: DaoMotifRejet[]
}