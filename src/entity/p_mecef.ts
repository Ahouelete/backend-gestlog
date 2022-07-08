import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class P_MECEF {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        unique: true
    })
    nim: string

    @Column({
        nullable: false,
    })
    jwtToken: string

    @Column({
        nullable: false,
    })
    urlApiMECEF: string

    @Column({
        nullable: false,
    })
    etat: string

    @Column({
        length: 100,
        nullable: false,
    })
    adresse: string

    @Column({
        length: 100,
        nullable: false,
    })
    contact: string

    @Column({
        nullable: false,
    })
    dateExpJwt: Date
}