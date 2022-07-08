import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { FactureMarche } from "./factureMarche"
import { ModeReglement } from "./modeReglement"

@Entity()
export class ReglementFactureMarche {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
    })
    dateReg: Date

    @Column({
        length: 100,
        nullable: true,
    })
    reference: string

    @CreateDateColumn()
    dateCreated: Date

    @Column()
    montantReg: number

    @ManyToOne(() => FactureMarche, (factureMarche) => factureMarche.reglementFactureMarche)
    @JoinColumn()
    factureMarche: FactureMarche

    @ManyToOne(() => ModeReglement, (modeReglement) => modeReglement.reglementFactureMarche)
    @JoinColumn()
    modeReglement: ModeReglement

    @Column({
        nullable: true
    })
    autresInfo: string
}