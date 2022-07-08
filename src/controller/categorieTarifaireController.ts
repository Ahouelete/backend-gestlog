//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { CategorieTarifaire } from "../entity/categorieTarifaire";


//Constantes
const categorieTarifaireRepository = AppDataSource.getRepository(CategorieTarifaire)

//Controller
export class CategorieTarifaireController {
    //
    async all(req, res, next) {
        try {
            const results = await categorieTarifaireRepository.find()
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async add(req, res, next) {
        try {
            const categorieTarifaireAdd = req.body
            if (categorieTarifaireAdd.code == null || categorieTarifaireAdd.code == undefined || categorieTarifaireAdd.intitule == null
                || categorieTarifaireAdd.intitule == undefined) {
                return res.send('Le code ou l\'intitulé de la categorie n\'est pas renseignée')
            }

            const results = await categorieTarifaireRepository.find(
                {
                    where: [
                        { code: categorieTarifaireAdd.code },
                        { intitule: categorieTarifaireAdd.intitule }
                    ]
                }
            )

            if (results.length != 0) {
                return res.send('Le code ou intitulé renseigné existe déjà pour une categorie tarifaire.')
            }

            const result = await categorieTarifaireRepository.create(categorieTarifaireAdd)
            const reslt = await categorieTarifaireRepository.save(result)
            return res.send(reslt)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {
        try {

            const categorieTarifaireUpdated = req.body
            const categorieTarifaireFound = await categorieTarifaireRepository.findOneBy({ id: categorieTarifaireUpdated.id })
            if (categorieTarifaireFound == null || categorieTarifaireFound == undefined) {
                return res.send('Cette Categorie tarifaire n\'existe pas')
            }
            if (categorieTarifaireUpdated.code == null || categorieTarifaireUpdated.code == undefined) {
                return res.send('La rubrique code de l\'objet Categorie Tarifaire nest pas renseignée')
            }
            if (categorieTarifaireUpdated.intitule == null || categorieTarifaireUpdated.intitule == undefined) {
                return res.send('La rubrique intitule de l\'objet Categorie Tarifaire nest pas renseignée')
            }

            const results = await categorieTarifaireRepository.find({
                where: [
                    { code: categorieTarifaireUpdated.code, id: Not(categorieTarifaireUpdated.id) },
                    { intitule: categorieTarifaireUpdated.intitule, id: Not(categorieTarifaireUpdated.id) }
                ]
            })

            if (results.length != 0) {
                return res.send('Le code ou intitulé renseigné existe déjà pour une Categorie tarifaire.')
            }
            const result = await categorieTarifaireRepository.update({ id: categorieTarifaireUpdated.id }, categorieTarifaireUpdated)
            const reslt = await categorieTarifaireRepository.findOneBy({ id: categorieTarifaireUpdated.id })
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
            const categorieTarifaireFound = await categorieTarifaireRepository.find({
                where: {
                    id: id
                }
            })
            await categorieTarifaireRepository.remove(categorieTarifaireFound)
            return res.send('Supprimé avec succes').status(200)

        } catch (error) {
            return res.send(req.params)
        }
    }
}