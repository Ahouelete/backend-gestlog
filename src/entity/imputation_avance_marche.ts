import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AvanceMarche } from "./avance_marche";
import { Marche } from "./marche";
import { ReglementFactureMarche } from "./reglementFactureMarche";

@Entity()
export class ImputationAvanceMarche {

    @Column()
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    dateCretedAt: Date

    @Column()
    avanceImpute: number

    @ManyToOne(()=> AvanceMarche, (avance_marche)=> avance_marche.imputationAvanceMarche)
    @JoinColumn()
    avance_marche: AvanceMarche

    @ManyToOne(()=> ReglementFactureMarche, (reglementFactureMarche)=> reglementFactureMarche.imputationAvanceMarche)
    @JoinColumn()
    reglementFactureMarche: ReglementFactureMarche

}