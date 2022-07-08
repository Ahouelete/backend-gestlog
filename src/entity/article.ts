import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { CategorieArticle } from "./categorieArticle"
import { DeclarationPanne } from "./declarationPanne"
import { Famille } from "./famille"
import { TypeArticle } from "./typeArticle"

export enum statutArticle {
    ACTIF = 'ACTIF',
    EN_SOMMEIL = 'EN_SOMMEIL'
}

export enum matiereArticle {
    FINI = 'FINI',
    SEMI_FINI = 'SEMI_FINI',
    PREMIERE = 'PREMIERE'
}

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 10,
        nullable: false,
        unique: true
    })
    reference: string

    @Column({
        length: 100,
        nullable: false,
    })
    designation: string

    @Column({
        length: 100
    })
    aliasArticle: string

    @Column({
        length: 100
    })
    codeBarre: string

    @Column()
    prixAchTTC: number

    @Column()
    prixVteTTC: number

    @Column()
    estUnique: boolean

    @Column()
    estLouer: boolean

    @Column()
    agregat: boolean

    @Column()
    estImmobilise: boolean

    @Column()
    enPanne: boolean

    @Column({
        nullable: false,
        type: 'enum',
        enum: matiereArticle,
        default: matiereArticle.FINI
    })
    matiere: matiereArticle

    @Column({
        nullable: false,
        type: 'enum',
        enum: statutArticle,
        default: statutArticle.ACTIF
    })
    statut: statutArticle

    @ManyToOne(() => Famille, (famille) => famille.articles)
    @JoinColumn()
    famille: Famille

    @ManyToOne(() => TypeArticle, (typeArticle) => typeArticle.articles)
    @JoinColumn()
    typeArticle: TypeArticle

    @ManyToOne(() => CategorieArticle, (categorieArticle) => categorieArticle.articles)
    @JoinColumn()
    categorieArticle: CategorieArticle

    @OneToMany(() => DeclarationPanne, (declarationPanne) => declarationPanne.article)
    declarationPannes: DeclarationPanne[]
}