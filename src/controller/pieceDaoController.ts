//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { PieceDao } from "../entity/piece_dao";

//Constantes
const pieceDaoRepository = AppDataSource.getRepository(PieceDao)
//Controller
export class PieceDaoController {
    //
    async all(req, res, next) {
        try {
            const results = await pieceDaoRepository.find()
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const pieceDaoAdd = req.body
            if (pieceDaoAdd.code == null || pieceDaoAdd.code == undefined || pieceDaoAdd.designation == null
                || pieceDaoAdd.designation == undefined) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }

            const results = await pieceDaoRepository.find(
                {
                    where: [
                        { code: pieceDaoAdd.code },
                        { designation: pieceDaoAdd.designation }
                    ]
                }
            )
            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou désignation renseigné existe déjà pour une autre pièce.' })
            }

            const result = await pieceDaoRepository.create(pieceDaoAdd)
            const reslts = await pieceDaoRepository.save(result)
            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error.deatils })
        }
    }

    async update(req, res, next) {
        try {
            const pieceDaoUpdate = req.body
            if (pieceDaoUpdate.code == null || pieceDaoUpdate.code == undefined || pieceDaoUpdate.designation == null
                || pieceDaoUpdate.designation == undefined) {
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont non renseignées' })
            }
            const results = await pieceDaoRepository.find({
                where: [
                    { code: pieceDaoUpdate.code, id: Not(pieceDaoUpdate.id) },
                    { designation: pieceDaoUpdate.designation, id: Not(pieceDaoUpdate.id) }
                ]
            })
            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou designation renseigné existe déjà pour une autre pièce.' })
            }
            await pieceDaoRepository.update({ id: pieceDaoUpdate.id }, pieceDaoUpdate)
            const reslt = await pieceDaoRepository.find({
                where: {
                    id: pieceDaoUpdate.id,
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
            const pieceDaoFound = await pieceDaoRepository.find({
                where: {
                    id: id
                }
            })
            await pieceDaoRepository.remove(pieceDaoFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}