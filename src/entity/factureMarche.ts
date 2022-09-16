import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"
import { Marche } from "./marche"
import { ReglementFactureMarche } from "./reglementFactureMarche"

@Entity()
export class FactureMarche {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        nullable: true,
    })
    reference: string

    @CreateDateColumn()
    dateCreated: Date

    @UpdateDateColumn()
    dateUpdated: Date

    @Column()
    montantFacture: number

    @Column()
    montantPaye: number

    @OneToMany(() => ReglementFactureMarche, (reglementFactureMarche) => reglementFactureMarche.factureMarche)
    reglementFactureMarche: ReglementFactureMarche []

    @ManyToOne(() => Marche, (marche) => marche.factureMarche)
    @JoinColumn()
    marche: Marche

    @Column({
        nullable: false
    })
    statut: string

    @Column()
    desgnOperation: string

    @Column({
        nullable: true
    })
    uid: string

    @Column({
        nullable: true
    })
    qrcode: string

    @Column({
        nullable: true
    })
    codeMECeFDGI: string

    @Column({
        nullable: true
    })
    dateTimeMECeF: string

    @Column({
        nullable: true
    })
    countersMECeF: string

    @Column({
        nullable: true
    })
    NIMMECEF: string

    @Column({
        nullable: true
    })
    AIB: number
    
    @Column({
        nullable: true
    })
    Taux_AIB: number

    @Column({
        nullable: true
    })
    BaseAIB: number

    @Column({
        nullable: true
    })
    tax_TVA: number

    @Column({
        nullable: true
    })
    remise: number

    @Column({
        nullable: true
    })
    montantNetHt: number

    @Column({
        nullable: true
    })
    montantNetTTC: number

    @Column({
        nullable: true
    })
    netAPayer: number
    
}