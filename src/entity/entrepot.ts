import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { OperationChantier } from "./operationChantier"
import { Tiers } from "./tiers"

export enum statutEntrepot {
    NEANT = 'NEANT',
    OUVERT = 'OUVERT',
    FERMER = 'FERMER',
    CLOTURER = 'CLOTURER'
}
@Entity()
export class Entrepot {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    intitule: string

    @Column({
        length: 150
    })
    responsable: string

    @Column({
        type: 'enum',
        enum: statutEntrepot,
        default: statutEntrepot.NEANT
    })
    statut: statutEntrepot

    @ManyToOne(() => Tiers, (tiers) => tiers.entrepots)
    @JoinColumn()
    tiers: Tiers

    @OneToMany(() => OperationChantier, (operationChantier) => operationChantier.entrepot)
    operationChantiers: OperationChantier[]
}