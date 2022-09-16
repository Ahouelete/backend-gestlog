import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Dao } from "./dao"
import { ImputationAvanceMarche } from "./imputation_avance_marche"
import { Marche } from "./marche"
import { ModeReglement } from "./modeReglement"

@Entity()
export class AvanceMarche {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    libelle: string

    @Column({
        length: 100,
        nullable: false,
    })
    reference: string

    @CreateDateColumn()
    dateCreatedAt: Date

    @UpdateDateColumn()
    dateUpdateddAt: Date

    @Column()
    date: Date

    @Column({
        nullable: false
    })
    avance: number

    @Column({
        default:0,
        nullable: true
    })
    avanceDisponible: number

    @ManyToOne(() => Marche, (marche) => marche.avance_marche)
    @JoinColumn()
    marche: Marche

    @ManyToOne(() => ModeReglement, (modeReglement) => modeReglement.avance_marche)
    @JoinColumn()
    modeReglement: ModeReglement

    @OneToMany(() => Dao, (dao) => dao.statutDao)
    daos: Dao[]

    @OneToMany(() => ImputationAvanceMarche, (imputationAvanceMarche) => imputationAvanceMarche.avance_marche)
    imputationAvanceMarche: ImputationAvanceMarche[]
}