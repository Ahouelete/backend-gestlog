import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm"
import { Entrepot } from "./entrepot"
export enum typeOperation {
    FERMER = 'FERMER',
    OUVERT = 'OUVERT',
    CLOTURER = 'CLOTURER',
    NEANT = 'NEANT'
}

@Entity()
export class OperationChantier {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        update: false
    })
    date: Date

    @Column({
        nullable: false,
        update: false
    })
    heure: string

    @Column({
        length: 250
    })
    observation: string

    @Column({
        nullable:false,
        type: 'enum',
        enum: typeOperation,
        default: typeOperation.NEANT,
        update: false
    })
    type: typeOperation
    
    @ManyToOne(() => Entrepot, (entrepot) => entrepot.operationChantiers)
    @JoinColumn()
    entrepot: Entrepot
}