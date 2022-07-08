//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Chantier } from "../entity/chantier";
import { ContratSousTraitant } from "../entity/contrat_sous_traitant";
import { Marche } from "../entity/marche";
import { Tiers } from "../entity/tiers";

//Constantes
const contratSousTraitantRepository = AppDataSource.getRepository(ContratSousTraitant)
const chantierRepository = AppDataSource.getRepository(Chantier)
const tiersRepository = AppDataSource.getRepository(Tiers)

//Controller
export class ContratSousTraitantController {
    //
    async all(req, res, next) {
        try {
            const results = await contratSousTraitantRepository.find({
                relations: {
                    chantier: true,
                    tiers: true
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const contratAdd = req.body
            if (contratAdd.code == null || contratAdd.code == undefined || contratAdd.designation == null
                || contratAdd.designation == undefined || contratAdd.dateDebContrat == undefined
                || contratAdd.dateDebContrat == null || contratAdd.travaux == undefined
                || contratAdd.travaux == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }

            if (contratAdd.dateFinContrat) {
                if (contratAdd.dateDebContrat > contratAdd.dateFinContrat)
                    return res.send({
                        description: 'error',
                        message: 'La date contractuelle d\'ouverture ne peut être superieure à celle de clôture'
                    })
            }


            if (contratAdd.statut != 'EN COURS' && contratAdd.statut != 'TERMINER') {
                return res.send({ description: 'error', message: 'Le statut du contrat est invalide' })
            }


            const tiersFound = await tiersRepository.findOne({
                relations: {
                    typeTiers: true
                },
                where: {
                    id: contratAdd.tiers.id,
                    numero: contratAdd.tiers.numero,
                    intitule: contratAdd.tiers.intitule,
                }
            })

            if (!tiersFound) return res.send({ description: 'error', message: "Ce sous traitant n'exite pas" })
            if (tiersFound.typeTiers.id != 3) return res.send({ description: 'error', message: "Ce sous traitant n'exite pas" })

            const chantierFound = await chantierRepository.findOne({
                relations: {
                    marche: true
                },
                where: {
                    id: contratAdd.chantier.id,
                    code: contratAdd.chantier.code,
                    designation: contratAdd.chantier.designation,
                }
            })

            if (!chantierFound) return res.send({ description: 'error', message: "Ce chantier n'exite pas" })

            if (chantierFound.statut == 'ARRET DEFINITIF' || chantierFound.statut == 'ARRET PROVISOIRE' ||
                chantierFound.statut == 'RECEPTION DEFINITIVE')
                return res.send({ description: 'error', message: "Le statut du chantier ne permet pas l'ajout d'un nouveau contrat" })

            const results = await contratSousTraitantRepository.find(
                {
                    where: [
                        { code: contratAdd.code },
                        { designation: contratAdd.designation }
                    ]
                }
            )

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou désignation renseigné existe déjà pour un contrat.' })
            }

            const result = await contratSousTraitantRepository.create(contratAdd)
            const reslts = await contratSousTraitantRepository.save(result)
            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error.deatils })
        }
    }

    async update(req, res, next) {
        try {

            const contratAdd = req.body
            if (contratAdd.code == null || contratAdd.code == undefined || contratAdd.designation == null
                || contratAdd.designation == undefined || contratAdd.dateDebContrat == undefined
                || contratAdd.dateDebContrat == null || contratAdd.travaux == undefined
                || contratAdd.travaux == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }

            if (contratAdd.dateFinContrat) {
                if (contratAdd.dateDebContrat > contratAdd.dateFinContrat)
                    return res.send({
                        description: 'error',
                        message: 'La date contractuelle d\'ouverture ne peut être superieure à celle de clôture'
                    })
            }


            if (contratAdd.statut != 'EN COURS' && contratAdd.statut != 'TERMINER') {
                return res.send({ description: 'error', message: 'Le statut du contrat est invalide' })
            }

            const tiersFound = await tiersRepository.findOne({
                relations: {
                    typeTiers: true
                },
                where: {
                    id: contratAdd.tiers.id,
                    numero: contratAdd.tiers.numero,
                    intitule: contratAdd.tiers.intitule,
                }
            })
            if (!tiersFound) return res.send({ description: 'error', message: "Ce sous traitant n'exite pas" })
            if (tiersFound.typeTiers.id != 3) return res.send({ description: 'error', message: "Ce sous traitant n'exite pas" })

            const chantierFound = await chantierRepository.findOne({
                relations: {
                    marche: true
                },
                where: {
                    id: contratAdd.chantier.id,
                    code: contratAdd.chantier.code,
                    designation: contratAdd.chantier.designation,
                }
            })

            if (!chantierFound) return res.send({ description: 'error', message: "Ce chantier n'exite pas" })

            if (chantierFound.statut == 'ARRET DEFINITIF' || chantierFound.statut == 'ARRET PROVISOIRE' ||
                chantierFound.statut == 'RECEPTION DEFINITIVE')
                return res.send({ description: 'error', message: "Le statut du chantier ne permet pas l'ajout d'un nouveau contrat" })

            const results = await contratSousTraitantRepository.find({
                where: [
                    { code: contratAdd.code, id: Not(contratAdd.id) },
                    { designation: contratAdd.designation, id: Not(contratAdd.id) }
                ]
            })

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou designation renseigné existe déjà pour un contrat.' })
            }

            await contratSousTraitantRepository.update({ id: contratAdd.id }, contratAdd)
            const reslt = await contratSousTraitantRepository.find({
                where: {
                    id: contratAdd.id,
                },
                relations: {
                    chantier: true
                }
            })
            return res.send({ description: 'success', data: reslt })

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async delete(req, res, next) {

        try {

            const { id } = req.params
            if (id == null || id == undefined) {
                return res.send({ description: 'error', message: 'ID invalide ou incorrect' })
            }
            const daoFound = await contratSousTraitantRepository.find({
                where: {
                    id: id
                }
            })
            await contratSousTraitantRepository.remove(daoFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}