//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Chantier } from "../entity/chantier";
import { Marche } from "../entity/marche";

//Constantes
const marcheRepository = AppDataSource.getRepository(Marche)
const chantierRepository = AppDataSource.getRepository(Chantier)
//Controller
export class ChantierController {
    //
    async all(req, res, next) {
        try {
            const results = await chantierRepository.find({
                relations: {
                    marche: true
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const chantierAdd = req.body
            if (chantierAdd.code == null || chantierAdd.code == undefined || chantierAdd.designation == null
                || chantierAdd.designation == undefined || chantierAdd.dateContratClot == undefined
                || chantierAdd.dateContratClot == null || chantierAdd.dateContratOuv == undefined
                || chantierAdd.dateContratOuv == null || chantierAdd.responsable == undefined
                || chantierAdd.responsable == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }
            if (chantierAdd.dateContratOuv > chantierAdd.dateContratClot)
                return res.send({
                    description: 'error',
                    message: 'La date contractuelle d\'ouverture ne peut être superieure a celle de clôture'
                })

            if (chantierAdd.statut != 'ARRET PROVISOIRE' && chantierAdd.statut != 'ARRET DEFINITIF'
                && chantierAdd.statut != 'EN COURS' && chantierAdd.statut != 'RECEPTION PROVISOIRE' &&
                chantierAdd.statut != 'RECEPTION DEFINITIVE') {
                return res.send({ description: 'error', message: 'Le statut du chantier invalide' })
            }

            const marcheFound = await marcheRepository.findOne({
                relations: {
                    statutMarche: true
                },
                where: {
                    id: chantierAdd.marche.id,
                    code: chantierAdd.marche.code,
                    designation: chantierAdd.marche.designation,
                }
            })
            if (!marcheFound) return res.send({ description: 'error', message: "Ce marché n'exite pas" })

            const results = await chantierRepository.find(
                {
                    where: [
                        { code: chantierAdd.code },
                        { designation: chantierAdd.designation }
                    ]
                }
            )
            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou désignation renseigné existe déjà pour ce chantier.' })
            }

            const result = await chantierRepository.create(chantierAdd)
            const reslts = await chantierRepository.save(result)
            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error.deatils })
        }
    }

    async update(req, res, next) {
        try {

            const chantierUpdate = req.body
            if (chantierUpdate.code == null || chantierUpdate.code == undefined || chantierUpdate.designation == null
                || chantierUpdate.designation == undefined || chantierUpdate.dateContratClot == undefined
                || chantierUpdate.dateContratClot == null || chantierUpdate.dateContratOuv == undefined
                || chantierUpdate.dateContratOuv == null || chantierUpdate.responsable == undefined
                || chantierUpdate.responsable == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }
            if (chantierUpdate.dateContratOuv > chantierUpdate.dateContratClot)
                return res.send({
                    description: 'error',
                    message: 'La date contractuelle d\'ouverture ne peut être superieure a celle de clôture'
                })

                if (chantierUpdate.statut != 'ARRET PROVISOIRE' && chantierUpdate.statut != 'ARRET DEFINITIF'
                && chantierUpdate.statut != 'EN COURS' && chantierUpdate.statut != 'RECEPTION PROVISOIRE' &&
                chantierUpdate.statut != 'RECEPTION DEFINITIVE') {
                return res.send({ description: 'error', message: 'Le statut du chantier invalide' })
            }

            const marcheFound = await marcheRepository.findOne({
                relations: {
                    statutMarche: true
                },
                where: {
                    id: chantierUpdate.marche.id,
                    code: chantierUpdate.marche.code,
                    designation: chantierUpdate.marche.designation,
                }
            })
            if (!marcheFound) return res.send({ description: 'error', message: "Ce marché n'exite pas" })

            const results = await chantierRepository.find({
                where: [
                    { code: chantierUpdate.code, id: Not(chantierUpdate.id) },
                    { designation: chantierUpdate.designation, id: Not(chantierUpdate.id) }
                ]
            })

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou designation renseigné existe déjà pour un chantier.' })
            }

            await chantierRepository.update({ id: chantierUpdate.id }, chantierUpdate)
            const reslt = await chantierRepository.find({
                where: {
                    id: chantierUpdate.id,
                },
                relations: {
                    marche: true
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
            const daoFound = await chantierRepository.find({
                where: {
                    id: id
                }
            })
            await chantierRepository.remove(daoFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allGetChantiersEnCours(req, res, next) {
        try {
            const chantierEnCours = await chantierRepository.createQueryBuilder("chantier")
                .leftJoinAndSelect("chantier.marche", "marche")
                .where("chantier.statut = :statut", { statut: 'EN COURS' })
                .orWhere("chantier.statut = :statut", { statut: 'RECEPTION PROVISOIRE'})
                .getMany()

            return res.send({ description: 'success', data: chantierEnCours }).status(200)
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}