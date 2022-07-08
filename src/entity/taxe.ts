import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum sensTaxe {
    DEDUCTIBLE = 'DEDUCTIBLE',
    RECUPERABLE = 'RECUPERABLE'
}
@Entity()
export class Taxe {

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
    intitule: string

    @Column({
        nullable: false,
        type: 'enum',
        enum: sensTaxe,
        default: sensTaxe.RECUPERABLE
    })
    sens: sensTaxe

    @Column({
        nullable: false
    })
    taux: number

    @Column({
        nullable: false
    })
    valeur: number
}