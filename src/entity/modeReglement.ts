import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { ReglementFactureMarche } from "./reglementFactureMarche"

@Entity()
export class ModeReglement {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    intitule: string
    @OneToMany(() => ReglementFactureMarche, (reglementFactureMarche) => reglementFactureMarche.modeReglement)
    reglementFactureMarche: ReglementFactureMarche
}