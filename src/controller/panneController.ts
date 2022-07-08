//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Panne } from "../entity/panne";



//Constantes
const panneRepository = AppDataSource.getRepository(Panne)

//Controller
export class PanneController {
    //
    async all(req, res, next) {
        try {
            const results = await panneRepository.find()
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async add(req, res, next) {
        try {
            const panneAdd = req.body
            if (panneAdd.intitule == null || panneAdd.intitule == undefined || panneAdd.categorie == null
                || panneAdd.categorie == undefined) {
                return res.send('La categorie ou l\'intitulé de la panne n\'est pas renseignée')
            }

            const results = await panneRepository.find(
                {
                    where: [
                        { intitule: panneAdd.intitule }
                    ]
                }
            )

            if (results.length != 0) {
                return res.send('Cette panne renseigné existe déjà.')
            }

            const result = await panneRepository.create(panneAdd)
            const reslt = await panneRepository.save(result)
            return res.send(reslt)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {
        try {

            const panneUpdated = req.body
            const panneFound = await panneRepository.findOneBy({ id: panneUpdated.id })
            if (panneFound == null || panneFound == undefined) {
                return res.send('Cette panne n\'existe pas')
            }
            if (panneUpdated.intitule == null || panneUpdated.intitule == undefined) {
                return res.send('La rubrique intitule de l\'objet Panne nest pas renseignée')
            }
            if (panneUpdated.intitule == null || panneUpdated.intitule == undefined) {
                return res.send('La rubrique categorie de l\'objet Panne nest pas renseignée')
            }

            const results = await panneRepository.find({
                where: [
                    { intitule: panneUpdated.intitule, id: Not(panneUpdated.id) }
                ]
            })

            if (results.length != 0) {
                return res.send('L\'intitulé renseigné existe déjà pour une autre panne.')
            }
            await panneRepository.update({ id: panneUpdated.id }, panneUpdated)
            const reslt = await panneRepository.findOneBy({ id: panneUpdated.id })
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
            const panneFound = await panneRepository.find({
                where: {
                    id: id
                }
            })
            await panneRepository.remove(panneFound)
            return res.send('Supprimé avec succes').status(200)

        } catch (error) {
            return res.send(req.params)
        }
    }
}