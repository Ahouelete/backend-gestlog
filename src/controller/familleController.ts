//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Famille } from "../entity/famille";


//Constantes
const familleRepository = AppDataSource.getRepository(Famille)

//Controller
export class FamilleController {
    //
    async all(req, res, next) {
        try {
            const results = await familleRepository.find()
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const familleAdd = req.body
            if (familleAdd.code == null || familleAdd.code == undefined || familleAdd.intitule == null
                || familleAdd.intitule == undefined) {
                return res.send({ description: 'error', message: 'Le code ou l\'intitulé de la famille n\'est pas renseignée'  })
            }

            const results = await familleRepository.find(
                {
                    where: [
                        { code: familleAdd.code },
                        { intitule: familleAdd.intitule }
                    ]
                }
            )

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou intitulé renseigné existe déjà pour une famille d\'article.'  })
            }

            const result = await familleRepository.create(familleAdd)
            const reslt = await familleRepository.save(result)
            return res.send({ description: 'success', data: reslt})
        }

        catch (error) {
            return res.send({description: 'error', message: error})
        }
    }

    async update(req, res, next) {
        try {

            const familleUpdated = req.body
            const familleFound = await familleRepository.findOneBy({ id: familleUpdated.id })
            if (familleFound == null || familleFound == undefined) {
                return res.send({ description: 'error', message: 'Cette famille d\'article n\'existe pas'})
            }
            if (familleUpdated.code == null || familleUpdated.code == undefined) {
                return res.send({ description: 'error', message: 'La rubrique code de l\'objet Famille nest pas renseignée'})
            }
            if (familleUpdated.intitule == null || familleUpdated.intitule == undefined) {
                return res.send({ description: 'error', message: 'La rubrique intitule de l\'objet Famille nest pas renseignée'})
            }
            const results = await familleRepository.find({
                where: [
                    { code: familleUpdated.code, id: Not(familleUpdated.id) },
                    { intitule: familleUpdated.intitule, id: Not(familleUpdated.id) }
                ]
            })

            if (results.length != 0) {
                return res.send({description: 'error', message: 'Le code ou intitulé renseigné existe déjà pour une famille d\'article.'})
            }
            const result = await familleRepository.update({ id: familleUpdated.id }, familleUpdated)
            const reslt = await familleRepository.findOneBy({ id: familleUpdated.id })
            return res.send({description: 'success', data: reslt})

        } catch (error) {
            return res.send({description: 'error', message: error})
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            if (id == null || id == undefined) {
                return res.send({description: 'error', message: 'ID invalide ou incorrect'})
            }
            const familleFound = await familleRepository.find({
                where: {
                    id: id
                }
            })
            await familleRepository.remove(familleFound)
            return res.send({description: 'success', data: 'Supprimé avec succes'}).status(200)

        } catch (error) {
            return res.send({description: 'error', message: error})
        }
    }
}