//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { MotifRejet } from "../entity/motifDao";
import { Soumissionnaire } from "../entity/soumissionnaire";

//Constantes
const soumissionnaireRepository = AppDataSource.getRepository(Soumissionnaire)
//Controller
export class SoumissionnaireController {
    //
    async all(req, res, next) {
        try {
            const results = await soumissionnaireRepository.find()
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const soumissionnaireAdd = req.body
            if (soumissionnaireAdd.numero == null || soumissionnaireAdd.numero == undefined
                || soumissionnaireAdd.intitule == null || soumissionnaireAdd.intitule == undefined) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }

            const results = await soumissionnaireRepository.findOne(
                {
                    where: [
                        { numero: soumissionnaireAdd.numero },
                        { intitule: soumissionnaireAdd.intitule }
                    ]
                }
            )
            if (results) {
                return res.send({ description: 'error', message: 'Le soumissionnaire renseigné existe déjà.' })
            }

            const result = await soumissionnaireRepository.create(soumissionnaireAdd)
            const reslts = await soumissionnaireRepository.save(result)
            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error.deatils })
        }
    }

    async update(req, res, next) {
        try {
            const soumissionnaireUpdate = req.body
            if (soumissionnaireUpdate.numero == null || soumissionnaireUpdate.numero == undefined
                || soumissionnaireUpdate.intitule == null || soumissionnaireUpdate.intitule == undefined) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }
            const results = await soumissionnaireRepository.findOne({
                where: [
                    { numero: soumissionnaireUpdate.numero, id: Not(soumissionnaireUpdate.id) },
                    { intitule: soumissionnaireUpdate.intitule, id: Not(soumissionnaireUpdate.id) }
                ]
            })
            if (results) {
                return res.send({ description: 'error', message: 'Le soumissionnaire renseigné existe déjà.' })
            }

            await soumissionnaireRepository.update({ id: soumissionnaireUpdate.id }, soumissionnaireUpdate)
            const reslt = await soumissionnaireRepository.find({
                where: {
                    id: soumissionnaireUpdate.id,
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
            const motifRejetFound = await soumissionnaireRepository.find({
                where: {
                    id: id
                }
            })
            await soumissionnaireRepository.remove(motifRejetFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}