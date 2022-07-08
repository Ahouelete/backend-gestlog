import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeclarationPanne } from "./declarationPanne";

@Entity()
export class Panne{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length:100,
        nullable: false
    })
    intitule: string

    @Column({
        length: 100,
        nullable: false
    })
    categorie: string

    @Column({
        length: 250
    })
    autresInfos: string

    @OneToMany(() => DeclarationPanne, (declarationPanne) => declarationPanne.panne)
    declarationPannes: DeclarationPanne[]
}