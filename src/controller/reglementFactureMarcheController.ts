//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Dao } from "../entity/dao";
import { FactureMarche } from "../entity/factureMarche";
import { ModeReglement } from "../entity/modeReglement";
import { ReglementFactureMarche } from "../entity/reglementFactureMarche";
import { Tiers } from "../entity/tiers";

//Constantes
const factureMarcheRepository = AppDataSource.getRepository(FactureMarche)
const reglementFactureMarcheRepository = AppDataSource.getRepository(ReglementFactureMarche)
const modeReglementRepository = AppDataSource.getRepository(ModeReglement)
const tiersRepository = AppDataSource.getRepository(Tiers)
const daoRepository = AppDataSource.getRepository(Dao)

export class ReglementFactureMarcheController {
    //

    async addReglementFactureMarche(req, res, next) {
        try {
            const reglementAdd = req.body
            if (reglementAdd.dateReg == null || reglementAdd.dateReg == undefined || reglementAdd.reference == null
                || reglementAdd.reference == undefined || reglementAdd.montantReg == 0 || reglementAdd.montantReg == undefined
                || reglementAdd.montantReg == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }

            const modeReglementFound = await modeReglementRepository.findOne({
                where: {
                    id: reglementAdd.modeReglement.id,
                    intitule: reglementAdd.modeReglement.intitule
                }
            })
            if (!modeReglementFound) return res.send({ description: 'error', message: "Ce mode de règlement est invalide" })

            const factureMarcheFound = await factureMarcheRepository.createQueryBuilder('factureMarche')
                .leftJoinAndSelect('factureMarche.marche', 'marche')
                .leftJoinAndSelect('marche.dao', 'dao')
                .leftJoinAndSelect('dao.tiers', 'tiers')
                .where("factureMarche.id = :id", { id: reglementAdd.factureMarche.id })
                .where("factureMarche.reference = :reference", { reference: reglementAdd.factureMarche.reference })
                .getOne()

            if (!factureMarcheFound) return res.send({ description: 'error', message: "L'objet facture est invalide" })

            const montantDuCalc = factureMarcheFound.montantFacture - factureMarcheFound.montantPaye
            if ((montantDuCalc - reglementAdd.montantReg) < 0)
                return res.send({ description: 'error', message: "Le montant du règlement ne peut être superieur au montnt dû" })

            const result = await reglementFactureMarcheRepository.create(reglementAdd)
            const reslts = await reglementFactureMarcheRepository.save(result)

            // Mise a jour de la facture
            const resteAPayer = montantDuCalc - reglementAdd.montantReg
            const statutFacture = resteAPayer == 0 ?
                'ENTIEREMENT PAYEE' : 'PARTIELLEMENT PAYEE'
            factureMarcheFound.statut = statutFacture
            factureMarcheFound.montantPaye = factureMarcheFound.montantFacture - resteAPayer
            await factureMarcheRepository.update({ id: factureMarcheFound.id }, factureMarcheFound)

            return res.send({ description: 'success', data: factureMarcheFound })

        }

        catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allInvoiceReglement(req, res, next) {

        try {
            const client = req.params.clientId
            const statutInvoice = req.params.statutInvoice
            let result = null

            // TOUS LES CLIENTS ET TOUS STATUS DE REGLEMNTS
            if (client == 'TOUS' && statutInvoice == 'TOUS') {
                result = await factureMarcheRepository.createQueryBuilder('factureMarche')
                    .leftJoinAndSelect('factureMarche.marche', 'marche')
                    .leftJoinAndSelect('marche.dao', 'dao')
                    .leftJoinAndSelect('dao.tiers', 'tiers')
                    .getMany()
            }

            // TOUS LES CLIENTS ET STATUS DE REGLEMNTS
            if (client == 'TOUS' && statutInvoice != 'TOUS') {
                result = await factureMarcheRepository.createQueryBuilder('factureMarche')
                    .leftJoinAndSelect('factureMarche.marche', 'marche')
                    .leftJoinAndSelect('marche.dao', 'dao')
                    .leftJoinAndSelect('dao.tiers', 'tiers')
                    .where('factureMarche.statut = :statut', { statut: statutInvoice })
                    .getMany()
            }

            // TOUS LES CLIENTS ET STATUS DE REGLEMNTS
            if (client != 'TOUS' && statutInvoice == 'TOUS') {
                result = await factureMarcheRepository.createQueryBuilder('factureMarche')
                    .leftJoinAndSelect('factureMarche.marche', 'marche')
                    .leftJoin('marche.dao', 'dao')
                    .where('dao.tiersId = :clientId', { clientId: client })
                    .getMany()
            }

            // TOUS LES CLIENTS ET STATUS DE REGLEMNTS
            if (client != 'TOUS' && statutInvoice != 'TOUS') {
                result = await factureMarcheRepository.createQueryBuilder('factureMarche')
                    .leftJoinAndSelect('factureMarche.marche', 'marche')
                    .leftJoin('marche.dao', 'dao')
                    .where('dao.tiersId = :clientId', { clientId: client })
                    .andWhere('factureMarche.statut = :statut', { statut: statutInvoice })
                    .getMany()
            }

            let countPAYEENT = 0
            let countNONPAYEE = 0
            let countPAYEPART = 0

            result.forEach(r => {
                if (r.statut == 'NON PAYEE')
                    countNONPAYEE++
                if (r.statut == 'ENTIEREMENT PAYEE')
                    countPAYEENT++
                if (r.statut == 'PARTIELLEMENT PAYEE')
                    countPAYEPART++
            })

            let option = [
                {
                    value: 'PAYER_ENTIEREMENT',
                    stat: countPAYEENT
                },
                {
                    value: 'PAYER_PARTIELLEMENT',
                    stat: countPAYEPART
                },
                {
                    value: 'NON_PAYER',
                    stat: countNONPAYEE
                }
            ]

            const resultat = {
                option: option,
                data: result
            }

            return res.send({ description: 'success', data: resultat })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }

    }

    async allClientInvoice(req, res, next) {
        try {
            const reslt = await tiersRepository.createQueryBuilder('tiers')
                .leftJoin('tiers.daos', 'dao')
                .leftJoin('dao.marche', 'marche')
                .leftJoin('marche.factureMarche', 'factureMarche')
                .where('factureMarche.id != :id', { id: 0 })
                .getMany()

            return res.send({ description: 'success', data: reslt })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}