//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Entrepot } from "../entity/entrepot";
import { Tiers } from "../entity/tiers";

//Constantes
const entrepotRepository = AppDataSource.getRepository(Entrepot)
const tiersRepository = AppDataSource.getRepository(Tiers)


//Controller
export class EntrepotController {
    //
    async all(req, res, next) {
        try {
            const results = await entrepotRepository.find({
                relations: {
                    tiers: true
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allEntrepotByTiers(req, res, next) {
        try {
            const id  = req.params.tiersId
            const tiers = await tiersRepository.findOneBy({ id })
            const results = await entrepotRepository.find({
                relations: {
                    tiers: true
                },
                where: {
                    tiers: {
                        id: tiers.id
                    }
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }
    async add(req, res, next) {
        try {

            const entrepotAdd = req.body
            if (entrepotAdd.intitule == null || entrepotAdd.intitule == undefined) {
                return res.send('L\'intitulé n\'est pas renseigné')
            }

            const tiers = await tiersRepository.find({
                where: {
                    id: entrepotAdd.tiers.id
                }
            })
            if (!tiers) return res.send('Le tiers associé à ce depot n\'existe pas')

            const entrepotFound = await entrepotRepository.find({
                where: {
                    intitule: entrepotAdd.intitule
                }
            })
            if(entrepotFound) return res.send('Cet entrepot existe deja')

            const result = await entrepotRepository.create(entrepotAdd)
            const reslt = await entrepotRepository.save(result)
            return res.send(reslt)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {

        try {
            const entrepotUpdated = req.body
            if (entrepotUpdated.intitule == null || entrepotUpdated.intitule == undefined) {
                return res.send('Un ou plusieurs obligatoire ne se sont pas renseignés')
            }

            const tiers = await tiersRepository.find({
                where: {
                    id: entrepotUpdated.tiers.id
                }
            })
            if (!tiers) return res.send('Le tiers associé à ce depot n\'existe pas')

            const entrepotFound = await entrepotRepository.find({
                where: {
                    intitule: entrepotUpdated.intitule,
                    id: Not(entrepotUpdated.id)
                }
            })
            if(entrepotFound) return res.send('Cet entrepot existe deja')

            await entrepotRepository.update({ id: entrepotUpdated.id }, entrepotUpdated)
            const reslt = await entrepotRepository.findOneBy({ id: entrepotUpdated.id })
            return res.send(reslt)

        } catch (error) {
            return res.send(error)
        }
    }

    async delete(req, res, next) {

        try {
            const { id } = req.params
            if (id == null || id == undefined) {
                return res.send('ID invalide ou incorrect')
            }
            const entrepotFound = await entrepotRepository.find({
                where: {
                    id: id
                }
            })
            await entrepotRepository.remove(entrepotFound)
            return res.send('Supprimé avec succes').status(200)

        } catch (error) {
            return res.send(req.params)
        }
    }
}