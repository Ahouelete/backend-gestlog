import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Marche } from "./marche"

@Entity()
export class StatutMarche {

    @PrimaryColumn()
    id: number

    @Column({
        length: 150,
        nullable: false,
    })
    statut: string

    @OneToMany(() => Marche, (marche) => marche.statutMarche)
    marche: Marche[]
}