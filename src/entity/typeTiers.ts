import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Tiers } from "./tiers"

@Entity()
export class TypeTiers {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    type: string

    @OneToMany(() => Tiers, (tiers) => tiers.typeTiers)
    tiers: Tiers[]
}