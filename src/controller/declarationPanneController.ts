//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Article } from "../entity/article";
import { DeclarationPanne } from "../entity/declarationPanne";
import { Panne } from "../entity/panne";

//Constantes
const declarationPanneRepository = AppDataSource.getRepository(DeclarationPanne)
const articleRepository = AppDataSource.getRepository(Article)
const panneRepository = AppDataSource.getRepository(Panne)


//Controller
export class DeclarationPanneController {
    //
    async all(req, res, next) {
        try {
            const results = await declarationPanneRepository.find({
                relations: {
                    article: true,
                    panne: true
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allDeclarationByPanne(req, res, next) {
        try {
            const id  = req.params.panneId
            const panne = await panneRepository.findOneBy({ id })
            const results = await declarationPanneRepository.find({
                relations: {
                    article: true,
                    panne: true
                },
                where: {
                    panne
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }
    async add(req, res, next) {
        try {

            const declarationPanneAdd = req.body
            if (declarationPanneAdd.datePanne == null || declarationPanneAdd.datePanne == undefined
                || declarationPanneAdd.heurePanne == null || declarationPanneAdd.heurePanne == undefined
                || declarationPanneAdd.kilometreParcouru == null || declarationPanneAdd.kilometreParcouru == undefined
                || declarationPanneAdd.dateDiagnostic == null || declarationPanneAdd.dateDiagnostic == undefined
                || declarationPanneAdd.descriptionDiagnostic == null || declarationPanneAdd.descriptionDiagnostic == undefined
                || declarationPanneAdd.descriptionPanne == null || declarationPanneAdd.descriptionPanne == undefined
                || declarationPanneAdd.article == null || declarationPanneAdd.article == undefined
                || declarationPanneAdd.heureDiagnostic == null || declarationPanneAdd.heureDiagnostic == undefined
                || declarationPanneAdd.lieuPanne == undefined || declarationPanneAdd.lieuPanne == undefined) {
                return res.send('Un ou plusieurs obligatoire ne se sont pas renseignés')
            }

            const panne = await panneRepository.find({
                where: {
                    id: declarationPanneAdd.panne.id
                }
            })
            if (!panne) return res.send('La panne associee la déclaration n\'existe pas')

            const result = await declarationPanneRepository.create(declarationPanneAdd)
            const reslt = await declarationPanneRepository.save(result)
            return res.send(reslt)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {

        try {
            const declarationPanneUpdated = req.body
            if (declarationPanneUpdated.datePanne == null || declarationPanneUpdated.datePanne == undefined
                || declarationPanneUpdated.heurePanne == null || declarationPanneUpdated.heurePanne == undefined
                || declarationPanneUpdated.kilometreParcouru == null || declarationPanneUpdated.kilometreParcouru == undefined
                || declarationPanneUpdated.dateDiagnostic == null || declarationPanneUpdated.dateDiagnostic == undefined
                || declarationPanneUpdated.descriptionDiagnostic == null || declarationPanneUpdated.descriptionDiagnostic == undefined
                || declarationPanneUpdated.descriptionPanne == null || declarationPanneUpdated.descriptionPanne == undefined
                || declarationPanneUpdated.article == null || declarationPanneUpdated.article == undefined
                || declarationPanneUpdated.heureDiagnostic == null || declarationPanneUpdated.heureDiagnostic == undefined
                || declarationPanneUpdated.lieuPanne == undefined || declarationPanneUpdated.lieuPanne == undefined) {
                return res.send('Un ou plusieurs obligatoire ne se sont pas renseignés')
            }

            const panne = await panneRepository.find({
                where: {
                    id: declarationPanneUpdated.panne.id
                }
            })
            if (!panne) return res.send('La panne associee la déclaration n\'existe pas')

            await declarationPanneRepository.update({ id: declarationPanneUpdated.id }, declarationPanneUpdated)
            const reslt = await declarationPanneRepository.findOneBy({ id: declarationPanneUpdated.id })
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
            const declarationPanneFound = await declarationPanneRepository.find({
                where: {
                    id: id
                }
            })
            await declarationPanneRepository.remove(declarationPanneFound)
            return res.send('Supprimé avec succes').status(200)

        } catch (error) {
            return res.send(req.params)
        }
    }
}