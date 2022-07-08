import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Article } from "./article"

@Entity()
export class TypeArticle {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    type: string

    @OneToMany(() => Article, (article) => article.typeArticle)
    articles: Article[]
}