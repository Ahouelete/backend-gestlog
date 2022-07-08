//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { CategorieArticle } from "../entity/categorieArticle";


//Constantes
const categorieArticleRepository = AppDataSource.getRepository(CategorieArticle)

//Controller
export class CategorieArticleController {
    //
    async all(req, res, next) {
        try {
            const results = await categorieArticleRepository.find()
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const categorieArticleAdd = req.body
            if (categorieArticleAdd.code == null || categorieArticleAdd.code == undefined || categorieArticleAdd.intitule == null
                || categorieArticleAdd.intitule == undefined) {
                return res.send({ description: 'error', message: 'Le code ou l\'intitulé de la categorie n\'est pas renseignée' })
            }

            const results = await categorieArticleRepository.find(
                {
                    where: [
                        { code: categorieArticleAdd.code },
                        { intitule: categorieArticleAdd.intitule }
                    ]
                }
            )

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou intitulé renseigné existe déjà pour une categorie d\'article.' })
            }

            const result = await categorieArticleRepository.create(categorieArticleAdd)
            const reslt = await categorieArticleRepository.save(result)
            return res.send({ description: 'success', data: reslt }).status(200)
        }

        catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async update(req, res, next) {
        try {

            const categorieArticleUpdated = req.body
            const familleFound = await categorieArticleRepository.findOneBy({ id: categorieArticleUpdated.id })
            if (familleFound == null || familleFound == undefined) {
                return res.send({ description: 'error', message: 'Cette Categorie d\'article n\'existe pas' })
            }
            if (categorieArticleUpdated.code == null || categorieArticleUpdated.code == undefined) {
                return res.send({ description: 'error', message: 'La rubrique code de l\'objet Categorie Article nest pas renseignée' })
            }
            if (categorieArticleUpdated.intitule == null || categorieArticleUpdated.intitule == undefined) {
                return res.send({ description: 'error', message: 'La rubrique intitule de l\'objet Categorie Article nest pas renseignée' })
            }

            const results = await categorieArticleRepository.find({
                where: [
                    { code: categorieArticleUpdated.code, id: Not(categorieArticleUpdated.id) },
                    { intitule: categorieArticleUpdated.intitule, id: Not(categorieArticleUpdated.id) }
                ]
            })

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou intitulé renseigné existe déjà pour une Categorie d\'article.' })
            }
            const result = await categorieArticleRepository.update({ id: categorieArticleUpdated.id }, categorieArticleUpdated)
            const reslt = await categorieArticleRepository.findOneBy({ id: categorieArticleUpdated.id })
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
            const categorieArticleFound = await categorieArticleRepository.find({
                where: {
                    id: id
                }
            })
            await categorieArticleRepository.remove(categorieArticleFound)
            return res.send({ description: 'success', message: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}