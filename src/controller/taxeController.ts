//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Taxe, sensTaxe } from "../entity/taxe";





//Constantes
const taxeRepository = AppDataSource.getRepository(Taxe)

//Controller
export class TaxeController {
    //
    async all(req, res, next) {
        try {
            const results = await taxeRepository.find()
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allTaxeBySens(req, res, next) {
        const {sens} = req.params
        try {
            const results = await taxeRepository.find({
                where: {
                    sens
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async add(req, res, next) {
        try {
            const taxeAdd = req.body
            if (taxeAdd.intitule == null || taxeAdd.intitule == undefined ||
                taxeAdd.code == null || taxeAdd.code == undefined
                || taxeAdd.taux == undefined || taxeAdd.taux == null
                || taxeAdd.valeur == undefined || taxeAdd.valeur == null
                || taxeAdd.sens == undefined || taxeAdd.sens == null) {
                return res.send('Un ou plusieurs champs obligatoires sont pas renseignés')
            }
            if(taxeAdd.sens != sensTaxe.DEDUCTIBLE && taxeAdd.sens != sensTaxe.RECUPERABLE) return res.send('Sens invalide ou incorrect')
            const results = await taxeRepository.find(
                {
                    where: [
                        {intitule: taxeAdd.intitule},
                        {code: taxeAdd.code}
                    ]
                }
            )
            if (results.length != 0) return res.send('Cette taxe existe dejà')          

            const result = await taxeRepository.create(taxeAdd)
            const reslt = await taxeRepository.save(result)
            return res.send(reslt)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {

        try {
            const taxeUpdated = req.body
            const taxeFound = await taxeRepository.findOneBy({ id: taxeUpdated.id })
            if (taxeFound == null || taxeFound == undefined) {
                return res.send('Cette taxe n\'existe pas')
            }
            if (taxeUpdated.intitule == null || taxeUpdated.intitule == undefined ||
                taxeUpdated.code == null || taxeUpdated.code == undefined
                || taxeUpdated.taux == undefined || taxeUpdated.taux == null
                || taxeUpdated.valeur == undefined || taxeUpdated.valeur == null
                || taxeUpdated.sens == undefined || taxeUpdated.sens == null) {
                return res.send('Un ou plusieurs champs obligatoires sont pas renseignés')
            }

            if(taxeUpdated.sens != sensTaxe.DEDUCTIBLE && taxeUpdated.sens != sensTaxe.RECUPERABLE) return res.send('Sens invalide ou incorrect')
            const results = await taxeRepository.find(
                {
                    where: [
                        {intitule: taxeUpdated.intitule, id: Not(taxeUpdated.id)},
                        {code: taxeUpdated.code, id: Not(taxeUpdated.id)}
                    ]
                }
            )
            if (results.length != 0) return res.send('Cette taxe existe dejà')

            await taxeUpdated.update({ id: taxeUpdated.id }, taxeUpdated)
            const reslt = await taxeRepository.findOneBy({ id: taxeUpdated.id })
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
            const taxeFound = await taxeRepository.find({
                where: {
                    id: id
                }
            })
            await taxeRepository.remove(taxeFound)
            return res.send('Supprimé avec succes').status(200)

        } catch (error) {
            return res.send(req.params)
        }
    }
}