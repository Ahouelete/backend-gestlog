import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContratSousTraitant } from "./contrat_sous_traitant";
import { Dao } from "./dao";
import { Entrepot } from "./entrepot";
import { TypeTiers } from "./typeTiers";

@Entity()
export class Tiers {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 10,
        nullable: false
    })
    numero: string

    @Column({
        length: 100,
        nullable: false
    })
    intitule: string

    @Column({
        length: 100,
        nullable: false
    })
    adresse: string

    @Column({
        length: 100,
        nullable: false
    })
    ville: string

    @Column({
        length: 100,
        nullable: false
    })
    region: string

    @Column({
        nullable: true
    })
    telephone1: string

    @Column({
        nullable: true
    })
    telephone2: string

    @Column({
        nullable: true
    })
    email: string

    @Column({
        nullable: true
    })
    site: string

    @Column({
        nullable: true
    })
    autresInfos: string
    
    @Column({
        nullable: true,
        length: 13
    })
    ifu: string

    @ManyToOne(() => TypeTiers, (typeTiers) => typeTiers.tiers)
    @JoinColumn()
    typeTiers: TypeTiers

    @OneToMany(() => Dao, (dao) => dao.tiers)
    daos: Dao

    @OneToMany(() => Entrepot, (entrepot) => entrepot.tiers)
    entrepots: Entrepot[]

    @OneToMany(() => ContratSousTraitant, (contratSousTraitant) => contratSousTraitant.tiers)
    contratSousTraitant: ContratSousTraitant[]
}