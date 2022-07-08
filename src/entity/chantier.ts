import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { ContratSousTraitant } from "./contrat_sous_traitant"
import { Marche } from "./marche"

@Entity()
export class Chantier {

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
    dateContratOuv: Date

    @Column({
        nullable: false
    })
    dateContratClot: Date

    @Column({
        nullable: true
    })
    dateOuvReel: Date

    @Column({
        nullable: true
    })
    dateClotReel: Date

    @Column({
        nullable: true
    })
    dateRecepProv: Date

    @Column({
        nullable: true
    })
    dateRecepDef: Date

    @Column({
        nullable: false,
        length : 100
    })
    responsable: string

    @Column({
        nullable: false,
        length : 100
    })
    statut: string

    @Column({
        length: 200,
        nullable: true
    })
    autresInfo: string

    @ManyToOne(() => Marche, (marche) => marche.chantier)
    @JoinColumn()
    marche: Marche

    @OneToMany(() => ContratSousTraitant, (contratSousTraitant) => contratSousTraitant.chantier)
    contratSousTraitant: ContratSousTraitant []
}