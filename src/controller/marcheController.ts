//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Dao } from "../entity/dao";
import { Marche } from "../entity/marche";
import { StatutDao } from "../entity/statutDao";
import { StatutMarche } from "../entity/statutMarche";
import { TypeFinancement } from "../entity/typeFinancement";

//Constantes
const marcheRepository = AppDataSource.getRepository(Marche)
const statutMarcheRepository = AppDataSource.getRepository(StatutMarche)
const typeFinancementRepository = AppDataSource.getRepository(TypeFinancement)
const daoRepository = AppDataSource.getRepository(Dao)
//Controller
export class MarcheController {
    //
    async all(req, res, next) {
        try {
            const results = await marcheRepository.find({
                relations: {
                    typeFinancement: true,
                    statutMarche: true,
                    dao: true
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const marcheAdd = req.body
            if (marcheAdd.code == null || marcheAdd.code == undefined || marcheAdd.designation == null
                || marcheAdd.designation == undefined || marcheAdd.maitreOuvrage == null || marcheAdd.maitreOuvrage == undefined) {
                return res.send({ description: 'error', message: 'Le code ou la désignation du dao n\'est pas renseignée' })
            }

            const statut = await statutMarcheRepository.find({
                where: {
                    id: marcheAdd.statutMarche.id,
                    statut: marcheAdd.statutMarche.status
                }
            })

            const type = await typeFinancementRepository.find({
                where: {
                    id: marcheAdd.typeFinancement.id,
                    type: marcheAdd.typeFinancement.type
                }
            })
            const dao = await daoRepository.find({
                where: {
                    id: marcheAdd.dao.id,
                    code: marcheAdd.dao.code,
                    designation: marcheAdd.dao.designation
                }
            })
            if (dao.length == 0) return res.send({ description: 'error', message: "L'objet DAO n'est pas valide ou n'exite pas" })
            if (statut.length == 0) return res.send({ description: 'error', message: "L'objet statutMarche n'est pas valide ou n'exite pas" })
            if (type.length == 0) return res.send({ description: 'error', message: "L'objet type Financement n'est pas valide ou n'exite pas" })

            const results = await marcheRepository.find(
                {
                    where: [
                        { code: marcheAdd.code },
                        { designation: marcheAdd.designation }
                    ]
                }
            )

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou désignation renseigné existe déjà pour un marché.' })
            }

            const result = await marcheRepository.create(marcheAdd)
            const reslts = await marcheRepository.save(result)
            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async update(req, res, next) {
        try {

            const marcheUpdated = req.body
            const marcheFound = await marcheRepository.findOneBy({ id: marcheUpdated.id })
            if (marcheFound == null || marcheFound == undefined) {
                return res.send({ description: 'error', message: 'Le marche n\'existe pas' })
            }

            if (marcheUpdated.code == null || marcheUpdated.code == undefined) {
                return res.send({ description: 'error', message: 'La rubrique code de l\'objet Marché nest pas renseignée' })
            }
            if (marcheUpdated.designation == null || marcheUpdated.designation == undefined) {
                return res.send({ description: 'error', message: 'La rubrique designation de l\'objet Marché nest pas renseignée' })
            }

            const statut = await statutMarcheRepository.find({
                where: {
                    id: marcheUpdated.statutMarche.id,
                    statut: marcheUpdated.statutMarche.status
                }
            })
            const type = await typeFinancementRepository.find({
                where: {
                    id: marcheUpdated.typeFinancement.id,
                    type: marcheUpdated.typeFinancement.type
                }
            })

            if (statut.length == 0) return res.send({ description: 'error', message: "L'objet StatutMarche n'est pas valide ou n'exite pas" })
            if (type.length == 0) return res.send({ description: 'error', message: "L'objet Type Financement n'est pas valide ou n'exite pas" })

            const results = await marcheRepository.find({
                where: [
                    { code: marcheUpdated.code, id: Not(marcheUpdated.id) },
                    { designation: marcheUpdated.designation, id: Not(marcheUpdated.id) }
                ]
            })

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou designation renseigné existe déjà pour un marché.' })
            }
            await marcheRepository.update({ id: marcheUpdated.id }, marcheUpdated)
            const reslt = await marcheRepository.find({
                where: {
                    id: marcheUpdated.id,
                },
                relations: {
                    statutMarche: true,
                    typeFinancement: true,
                    dao: true
                }
            })
            return res.send({ description: 'success', data: reslt })

        } catch (error) {
            return res.send({ description: 'error', message: 'error' })
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            if (id == null || id == undefined) {
                return res.send({ description: 'error', message: 'ID invalide ou incorrect' })
            }
            const marcheFound = await marcheRepository.find({
                where: {
                    id: id
                }
            })
            await marcheRepository.remove(marcheFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allMarcheByStatutMarche(req, res, next) {
        try {
            const { id } = req.params
            if (!id) return res.send({ description: 'error', message: 'ID renseigné est invalide ou incorrect' })
            const result = await statutMarcheRepository.findOneBy({ id: id })
            const results = await marcheRepository.find({
                where: {
                    statutMarche: result
                },
                relations: {
                    statutMarche: true,
                    dao: true,
                    typeFinancement: true
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allMarcheWinWithoutFacture(req, res, next) {
        try {
            const factures = await marcheRepository.createQueryBuilder("marche")
                .leftJoinAndSelect("marche.factureMarche", "factureMarche")
                .leftJoinAndSelect("marche.statutMarche", "statutMarche")
                .leftJoinAndSelect("marche.typeFinancement", "typeFinancement")
                .where("statutMarche.statut = :statut", { "statut": "RECEPTION DEFINITIVE" })
                .getMany()

            const result = []
            factures.forEach(marche => {
                if (!marche.factureMarche) {
                    result.push(marche)
                }
            })

            return res.send({ description: 'success', data: result })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allMarcheEnCours(req, res, next) {
        try {
            const result = await marcheRepository.createQueryBuilder("marche")
                .leftJoinAndSelect("marche.statutMarche", "statutMarche")
                .where("statutMarche.statut != :statut", { "statut": "RECEPTION DEFINITIVE" })
                .getMany()

            return res.send({ description: 'success', data: result })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}