import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum rolesUser{
    NONE = 'NONE',
    ADMIN = 'ADMIN',
    UTILISATEUR = 'UTILISATEUR'
}
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false
    })
    userName: string

    @Column({
        nullable: false,
        select: false
    })
    password: string

    @Column({
        length: 100,
        nullable: false
    })
    nom: string

    @Column({
        length: 200,
        nullable: false
    })
    prenoms: string

    @Column({
        length: 100,
        nullable: false
    })
    email: string

    @Column()
    telephone1: string

    @Column()
    telephone2: string

    @Column()
    adresse: string

    @Column()
    ville: string

    @Column()
    pays: string

    @Column()
    autresInfos: string

    @Column({
        select: false
    })
    isAdmin: boolean

    @Column({
        type: 'enum',
        enum: rolesUser,
        default: rolesUser.NONE,
        nullable: false,
        select: false
    })
    role: rolesUser
}
