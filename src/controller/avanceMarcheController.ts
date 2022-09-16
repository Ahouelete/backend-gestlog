//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { AvanceMarche } from "../entity/avance_marche";
import { Dao } from "../entity/dao";
import { Marche } from "../entity/marche";
import { ModeReglement } from "../entity/modeReglement";
import { TypeFinancement } from "../entity/typeFinancement";

//Constantes
const marcheRepository = AppDataSource.getRepository(Marche)
const modeReglementRepository = AppDataSource.getRepository(ModeReglement)
const avanceMarcheRepository = AppDataSource.getRepository(AvanceMarche)
//Controller
export class AvanceMarcheController {
    //
    async all(req, res, next) {
        try {
            const results = await avanceMarcheRepository.find({
                relations: {
                    marche: true,
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const avanceAdd = req.body
            if (avanceAdd.libelle == null || avanceAdd.libelle == undefined
                || avanceAdd.avance == undefined || avanceAdd.avance == null || avanceAdd.avance == 0) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires ne sont pas renseignées' })
            }

            const modeReglementFound = await modeReglementRepository.findOne({
                where: {
                    id: avanceAdd.modeReglement.id,
                    intitule: avanceAdd.modeReglement.intitule
                }
            })
            if (!modeReglementFound) return res.send({ description: 'error', message: "L'objet mode de règlement n'est pas valide ou n'exite pas" })

            const marcheFound = await marcheRepository.findOne({
                where: {
                    id: avanceAdd.marche.id,
                    code: avanceAdd.marche.code,
                    designation: avanceAdd.marche.designation
                },
                relations: {
                    avance_marche: true,
                    factureMarche: {
                        reglementFactureMarche: true
                    }
                }
            })
            if (marcheFound)
                return res.send({ description: 'error', message: "L'objet marche n'est pas valide ou n'exite pas" })

            if (marcheFound.statutMarche.statut = 'RECEPTION DEFINITIVE')
                return res.send({ description: 'error', message: "Ce marché a été déjà receptionné de facon définitive" })

            const montantDuMarche = marcheFound.montantGlobal
            const avanceEnCours = avanceAdd.avance
            let totalAvanceDispo = 0
            let totalSolder = 0
            marcheFound.avance_marche.forEach(element => {
                totalAvanceDispo = totalAvanceDispo + element.avanceDisponible
            })
            marcheFound.factureMarche.forEach(element => {
                element.reglementFactureMarche.forEach(e => {
                    totalSolder = totalSolder + e.montantReg
                });
            })

            const diff = montantDuMarche - totalSolder - totalAvanceDispo - avanceEnCours
            if (diff < 0)
                return res.send({ description: 'error', message: 'La somme des avances ne peut être superieure au montant du marche' })


            const result = await avanceMarcheRepository.create(avanceAdd)
            const reslts = await avanceMarcheRepository.save(result)
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

            const statut = await avanceMarcheRepository.find()

            const type = await avanceMarcheRepository.find()

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
            const avanceFound = await avanceMarcheRepository.find({
                where: {
                    id: id
                }
            })
            await avanceMarcheRepository.remove(avanceFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allMarcheByStatutMarche(req, res, next) {
        try {
            const { id } = req.params
            if (!id) return res.send({ description: 'error', message: 'ID renseigné est invalide ou incorrect' })
            const result = await avanceMarcheRepository.findOneBy({ id: id })
            const results = await marcheRepository.find({
                where: {
                    statutMarche: {
                        id: result.id
                    }
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
            const factures = await marcheRepository.find(
                {
                    relations: {
                        statutMarche: true,
                        typeFinancement: true,
                        dao: true,
                        factureMarche: true
                    },
                    where: {
                        statutMarche: {
                            statut: 'RECEPTION DEFINITIVE'
                        },
                        estEntierementFacture: false
                    }
                }
            )

            const result = []
            factures.forEach(marche => {
                let somme = 0
                marche.factureMarche.forEach(element => {
                    somme = somme + element.montantFacture
                });
                const marcheItem = {
                    marche,
                    totalFacture: somme
                }
                result.push(marcheItem)
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