import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class P_SOCIETE {

    @PrimaryColumn()
    id: number

    @Column({
        nullable: false,
        length: 200
    })
    raisonSociale: string

    @Column({
        nullable: true,
        length: 100
    })
    rccm: string

    @Column({
        nullable: true,
    })
    capital: number

    @Column({
        nullable: true,
    })
    dateCreation: Date

    @Column({
        length: 100,
        nullable: false,
    })
    adresse: string

    @Column({
        length: 100,
        nullable: true,
    })
    tel1: string

    @Column({
        length: 100,
        nullable: true,
    })
    tel2: string

    @Column({
        nullable: true,
        type: 'text'
    })
    logo: string

    @Column({
        nullable: true,
        length: 13
    })
    ifu: string

    @Column({
        nullable: true
    })
    email: string

    @Column({
        nullable: true
    })
    siteInternet: string

    @Column({
        nullable: true
    })
    regime: string

    @Column({
        nullable: true
    })
    formeJuridique: string

    @Column({
        nullable: true
    })
    natureActivite: string

    @Column({
        nullable: true
    })
    activitePrincipale: string

    @Column({
        nullable: true
    })
    activiteSecondaire: string

}