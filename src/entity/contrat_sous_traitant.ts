import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { Chantier } from "./chantier"
import { Marche } from "./marche"
import { Tiers } from "./tiers"

@Entity()
export class ContratSousTraitant {

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
    dateDebContrat: Date

    @Column({
        nullable: true
    })
    dateFinContrat: Date

    @Column({
        nullable: true
    })
    montantInitial: number

    @Column({
        nullable: true
    })
    montantAvenant: number

    @Column({
        nullable: true
    })
    montantFacture: number

    @Column({
        nullable: true
    })
    montantPayer: number

    @Column({
        nullable: true
    })
    resteAPayer: number

    @Column({
        nullable: false,
        length : 100
    })
    statut: string

    @Column({
        length: 200,
        nullable: false
    })
    travaux: string

    @ManyToOne(() => Chantier, (chantier) => chantier.contratSousTraitant)
    @JoinColumn()
    chantier: Chantier

    @ManyToOne(() => Tiers, (tiers) => tiers.contratSousTraitant)
    @JoinColumn()
    tiers: Tiers
}