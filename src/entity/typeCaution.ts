import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class TypeCaution {

    @PrimaryColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
    })
    type: string
}