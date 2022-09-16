//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tiers } from "../entity/tiers";
import { TypeTiers } from "../entity/typeTiers";



//Constantes
const typeTiersRepository = AppDataSource.getRepository(TypeTiers)
const tiersRepository = AppDataSource.getRepository(Tiers)

//Controller
export class TiersController {

    async all(req, res, next) {
        try {
            const results = await tiersRepository.find({
                relations: {
                    typeTiers: true
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allTiersByTypeTiers(req, res, next) {
        try {
            const id = req.params.typeTiersId
            const typeTiers = await typeTiersRepository.findOneBy({ id })
            const results = await tiersRepository.find({
                relations: {
                    typeTiers: true
                },
                where: {
                    typeTiers: {
                        id: typeTiers.id
                    }
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const tiersAdd = req.body
            if (tiersAdd.intitule == null || tiersAdd.intitule == undefined ||
                tiersAdd.numero == null || tiersAdd.numero == undefined
                || tiersAdd.region == undefined || tiersAdd.region == null
                || tiersAdd.ville == undefined || tiersAdd.ville == null
                || tiersAdd.adresse == undefined || tiersAdd.adresse == null) {
                return res.send({ description: 'error', message: 'Une ou plusieurs rubriques obligatoires sont pas renseignées' })
            }

            const regex = new RegExp('[0-9]{13}')
            if (tiersAdd.ifu != null && tiersAdd.ifu != "") {
                if (!regex.test(tiersAdd.ifu))
                    return res.send({ description: 'error', message: 'le numero ifu est invalide' })
            }

            const results = await tiersRepository.find(
                {
                    where: [
                        { intitule: tiersAdd.intitule },
                        { numero: tiersAdd.numero }
                    ]
                }
            )
            if (results.length != 0) return res.send({ description: 'error', message: 'Ce tier existe déjà' })

            const typeTiers = await typeTiersRepository.findOne({
                where: {
                    id: tiersAdd.typeTiers.id,
                    type: tiersAdd.typeTiers.type
                }
            })

            if (!typeTiers) return res.send({ description: 'error', message: 'Le type du tiers n\'est pas valide' })
            const result = await tiersRepository.create(tiersAdd)
            const reslt = await tiersRepository.save(result)
            return res.send({ description: 'success', data: reslt })
        }

        catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error })
        }
    }

    async update(req, res, next) {
        try {

            const tiersUpdated = req.body
            const tiersFound = await tiersRepository.findOneBy({ id: tiersUpdated.id })
            if (tiersFound == null || tiersFound == undefined) {
                return res.send({ description: 'success', message: 'Ce tiers n\'existe pas' })
            }
            if (tiersUpdated.intitule == null || tiersUpdated.intitule == undefined ||
                tiersUpdated.numero == null || tiersUpdated.numero == undefined
                || tiersUpdated.region == undefined || tiersUpdated.region == null
                || tiersUpdated.ville == undefined || tiersUpdated.ville == null
                || tiersUpdated.adresse == undefined || tiersUpdated.adresse == null) {
                return res.send({ description: 'success', message: 'Une ou plusieurs rubriques obligatoires sont pas renseignées' })
            }
            const regex = new RegExp('[0-9]{13}')
            if (tiersUpdated.ifu != null && tiersUpdated.ifu != "") {
                if (!regex.test(tiersUpdated.ifu))
                    return res.send({ description: 'error', message: 'le numero ifu est invalide' })
            }

            const results = await tiersRepository.find({
                where: [
                    { intitule: tiersUpdated.intitule, id: Not(tiersUpdated.id) },
                    { numero: tiersUpdated.numero, id: Not(tiersUpdated.id) }
                ]
            })
            if (results.length != 0) return res.send({ description: 'success', message: 'Ce tier existe déjà' })

            const typeTiers = await typeTiersRepository.findOne({
                where: {
                    id: tiersUpdated.typeTiers.id,
                    type: tiersUpdated.typeTiers.type
                }
            })
            if (!typeTiers) return res.send({ description: 'success', message: 'Le type du tiers n\'est pas valide' })

            await tiersRepository.update({ id: tiersUpdated.id }, tiersUpdated)
            const reslt = await tiersRepository.findOneBy({ id: tiersUpdated.id })
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
            const tiersFound = await tiersRepository.find({
                where: {
                    id: id
                }
            })
            await tiersRepository.remove(tiersFound)
            return res.send({ description: 'success', message: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}