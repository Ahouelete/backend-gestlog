import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import { PieceJointeDao } from "./pieceJointeDao"

@Entity()
export class PieceDao {

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
    designation: string

    @OneToMany(() => PieceJointeDao, (pieceJointeDao) => pieceJointeDao.pieceDao)
    pieceJointeDao : PieceJointeDao []
}