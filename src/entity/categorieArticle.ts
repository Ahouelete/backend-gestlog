import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinColumn } from "typeorm"
import { Article } from "./article"

@Entity()
export class CategorieArticle {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 10,
        nullable: false,
        unique: true
    })
    code: string

    @Column({
        length: 100,
        nullable: false,
    })
    intitule: string

    @OneToMany(() => Article, (article) => article.categorieArticle)
    articles: Article[]
}