//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Article, statutArticle } from "../entity/article";
import { CategorieArticle } from "../entity/categorieArticle";
import { Famille } from "../entity/famille";
import { TypeArticle } from "../entity/typeArticle";


//Constantes
const articleRepository = AppDataSource.getRepository(Article)
const familleArticleRepository = AppDataSource.getRepository(Famille)
const typeArticleRepository = AppDataSource.getRepository(TypeArticle)
const categorieArticleRepository = AppDataSource.getRepository(CategorieArticle)

//Controller
export class ArticleController {
    //
    async all(req, res, next) {
        try {
            const results = await articleRepository.find({
                relations: {
                    typeArticle: true,
                    famille: true,
                    categorieArticle: true
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allArticleByFamille(req, res, next) {
        try {
            const id = req.params.familleId
            const famille = await familleArticleRepository.findOneBy({ id })
            const results = await articleRepository.find({
                relations: {
                    typeArticle: true,
                    famille: true,
                    categorieArticle: true
                },
                where: {
                    famille
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allArticleByTypeArticle(req, res, next) {
        try {
            const id = req.params.typeArticleId
            const typeArticle = await typeArticleRepository.findOneBy({ id })
            const results = await articleRepository.find({
                relations: {
                    typeArticle: true,
                    famille: true,
                    categorieArticle: true
                },
                where: {
                    typeArticle
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allArticleByCategorie(req, res, next) {
        try {
            const id = req.params.categorieId
            const categorieArticle = await categorieArticleRepository.findOneBy({ id })
            const results = await articleRepository.find({
                relations: {
                    typeArticle: true,
                    famille: true,
                    categorieArticle: true
                },
                where: {
                    categorieArticle
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allArticleByStatut(req, res, next) {
        try {
            const statut = req.params.statut
            const results = await articleRepository.find({
                relations: {
                    typeArticle: true,
                    famille: true,
                    categorieArticle: true
                },
                where: {
                    statut
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async add(req, res, next) {
        try {
            const articleAdd = req.body
            if (articleAdd.reference == null || articleAdd.reference == undefined ||
                articleAdd.designation == null || articleAdd.designation == undefined) {
                return res.send('Un ou plusieurs champs obligatoires sont pas renseignés')
            }

            if (articleAdd.statut == statutArticle.ACTIF || articleAdd.statut == statutArticle.EN_SOMMEIL) {
                // continue
            } else {
                return res.send('Le statut article n\'est pas valide')
            }

            const typearticle = typeArticleRepository.findOneBy({ id: articleAdd.typeArticle.id })
            if (!typearticle) return res.send('Le type article n\'existe pas')

            const categorieArticle = categorieArticleRepository.findOneBy({ id: articleAdd.categorieArticle.id })
            if (!categorieArticle) return res.send('La catégorie article n\'existe pas')

            const familleArticle = familleArticleRepository.findOneBy({ id: articleAdd.famille.id })
            if (!familleArticle) return res.send('La famille d\'article n\'existe pas')


            const results = await articleRepository.find(
                {
                    where: [
                        { reference: articleAdd.reference },
                        { designation: articleAdd.designation }
                    ]
                }
            )
            if (results.length != 0) return res.send('Cet article existe dejà')

            const result = await articleRepository.create(articleAdd)
            const reslt = await articleRepository.save(result)
            return res.send([
                { description: 'success' },
                { object: reslt }
            ]).status(200)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {
        try {

            const articleUpdated = req.body
            const articleFound = await articleRepository.findOneBy({ id: articleUpdated.id })
            if (articleFound == null || articleFound == undefined) {
                return res.send('Cet article n\'existe pas')
            }

            if (articleUpdated.reference == null || articleUpdated.reference == undefined ||
                articleUpdated.designation == null || articleUpdated.designation == undefined) {
                return res.send('Un ou plusieurs champs obligatoires sont pas renseignés')
            }

            if (articleUpdated.statut == statutArticle.ACTIF || articleUpdated.statut == statutArticle.EN_SOMMEIL) {
                // continue
            } else {
                return res.send('Le statut article n\'est pas valide')
            }

            const typearticle = typeArticleRepository.findOneBy({ id: articleUpdated.typeArticle.id })
            if (!typearticle) return res.send('Le type article n\'existe pas')

            const categorieArticle = categorieArticleRepository.findOneBy({ id: articleUpdated.categorieArticle.id })
            if (!categorieArticle) return res.send('La catégorie article n\'existe pas')

            const familleArticle = familleArticleRepository.findOneBy({ id: articleUpdated.famille.id })
            if (!familleArticle) return res.send('La famille d\'article n\'existe pas')

            const results = await articleRepository.find({
                where: [
                    { reference: articleUpdated.reference, id: Not(articleUpdated.id) },
                    { designation: articleUpdated.designation, id: Not(articleUpdated.id) }
                ]
            })
            if (results.length != 0) return res.send('Cet article existe dejà')

            await articleRepository.update({ id: articleUpdated.id }, articleUpdated)
            const reslt = await articleRepository.findOneBy({ id: articleUpdated.id })
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
            const articleFound = await articleRepository.find({
                where: {
                    id: id
                }
            })
            await articleRepository.remove(articleFound)
            return res.send('Supprimé avec succes').status(200)

        } catch (error) {
            return res.send(req.params)
        }
    }
}