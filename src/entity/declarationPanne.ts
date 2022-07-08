import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";
import { Panne } from "./panne";

@Entity()
export class DeclarationPanne{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false
    })
    datePanne: Date

    @Column({
        nullable: false
    })
    heurePanne: string

    @Column({
        length: 100,
        nullable: false
    })
    lieuPanne: string

    @Column({
        length: 250,
        nullable: false
    })
    descriptionPanne: string

    @Column({
        length: 150,
    })
    originePanne: string

    @Column({
        length: 100
    })
    technicien: string

    @Column({
        nullable: false
    })
    dateDiagnostic: Date

    @Column({
        nullable: false
    })
    heureDiagnostic: string

    @Column({
        length: 250,
        nullable: false
    })
    descriptionDiagnostic: string

    @Column({
        length: 50,
        nullable: false
    })
    numeroDevis: string

    @Column({
        nullable: false
    })
    kilometreParcouru: number

    @ManyToOne(() => Panne, (panne) => panne.declarationPannes)
    @JoinColumn()
    panne: Panne

    @ManyToOne(() => Article, (article) => article.declarationPannes)
    @JoinColumn()
    article: Article
}