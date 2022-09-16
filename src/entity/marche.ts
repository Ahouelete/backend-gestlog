import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { AvanceMarche } from "./avance_marche"
import { Chantier } from "./chantier"
import { Dao } from "./dao"
import { FactureMarche } from "./factureMarche"
import { StatutMarche } from "./statutMarche"
import { TypeFinancement } from "./typeFinancement"

@Entity()
export class Marche {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 10,
        nullable: false,
    })
    code: string

    @Column({
        length: 100,
        nullable: false,
    })
    designation: string

    @Column({
        length: 100,
        nullable: false,
    })
    maitreOuvrage: string

    @Column({
        length: 250,
        nullable: false,
    })
    travaux: string

    @Column({
        length: 150,
        nullable: true,
    })
    bailleur1: string

    @Column()
    tauxBailleur1: number

    @Column()
    montantBailleur1: number

    @Column({
        length: 150,
        nullable: true,
    })
    bailleur2: string

    @Column()
    tauxBailleur2: number

    @Column()
    montantBailleur2: number

    @Column({
        length: 150,
        nullable: true,
    })
    bailleur3: string

    @Column()
    tauxBailleur3: number

    @Column()
    montantBailleur3: number

    @Column()
    montantGlobal: number

    @Column({
        default: false
    })
    estEntierementFacture: boolean

    @Column()
    montantFacture: number

    @Column()
    montantPayer: number

    @Column()
    resteAPayer: number

    @Column({
        nullable: true
    })
    tauxRealisation: number

    @OneToOne(() => Dao, (dao) => dao.marche)
    @JoinColumn()
    dao: Dao

    @ManyToOne(() => TypeFinancement, (typeFinancement) => typeFinancement.marche)
    @JoinColumn()
    typeFinancement: TypeFinancement

    @ManyToOne(() => StatutMarche, (statutMarche) => statutMarche.marche)
    @JoinColumn()
    statutMarche: StatutMarche

    @OneToMany(() => FactureMarche, (factureMarche) => factureMarche.marche)
    factureMarche: FactureMarche[]

    @OneToMany(() => Chantier, (chantier) => chantier.marche)
    chantier: Chantier[]

    @OneToMany(() => AvanceMarche, (avance_marche) => avance_marche.marche)
    avance_marche: AvanceMarche[]
}   