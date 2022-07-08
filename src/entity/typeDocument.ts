import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class TypeDocument {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    intitule: string

    @Column()
    doType: number

    @Column()
    domain: number
}