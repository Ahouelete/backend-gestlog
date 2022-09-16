import { Blob } from "buffer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dao } from "./dao";
import { PieceDao } from "./piece_dao";
import { User } from "./User";

export enum nature{
    ORIGINALE = 'ORIGINALE',
    COPIE = 'COPIE'
}

@Entity()
export class PieceJointeDao {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nbCopie: number

    @Column({
        default: false
    })
    estEssentiel: boolean

    @Column({
        default: false
    })
    estEliminatoire: boolean

    @Column({
        default: false
    })
    estFacultatif: boolean

    @Column({
        default: false
    })
    estLegalise: boolean

    @Column({
        default: 0
    })
    dureeValiditePiece: number

    @Column({
        nullable: true
    })
    deadLine: Date

    @Column({
        type: 'enum',
        enum : nature,
        default: nature.ORIGINALE,
        nullable: false
    })
    nature: nature

    @ManyToOne(() => User, (personneResponsabilise) => personneResponsabilise.pieceAConsituerDao)
    @JoinColumn()
    personneResponsabilise: User

    @Column({ nullable: true, length: 100})
    messageParticulier: string

    @Column({
        default: false
    })
    estObligatoire: boolean

    @Column({
        nullable: true
    })
    pieceJointe: string

    @Column()
    estFournie: boolean

    @Column({
        nullable: true,
        length: 100
    })
    autresInfos: string

    @ManyToOne(() => PieceDao, (pieceDao) => pieceDao.pieceJointeDao)
    @JoinColumn()
    pieceDao: PieceDao

    @ManyToOne(() => Dao, (dao) => dao.pieceJointeDao)
    @JoinColumn()
    dao: Dao


}