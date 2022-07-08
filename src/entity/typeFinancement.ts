import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Marche } from "./marche"

@Entity()
export class TypeFinancement {

    @PrimaryColumn()
    id: number

    @Column({
        length: 150,
        nullable: false,
    })
    type: string

    @OneToMany(() => Marche, (marche) => marche.typeFinancement)
    marche: Marche[]
}