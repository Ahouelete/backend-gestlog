//imports
import { send } from "process";
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Dao } from "../entity/dao";
import { StatutDao } from "../entity/statutDao";
import { Tiers } from "../entity/tiers";

//Constantes
const daoRepository = AppDataSource.getRepository(Dao)
const statutDaoRepository = AppDataSource.getRepository(StatutDao)
const tiersRepository = AppDataSource.getRepository(Tiers)
//Controller
export class DaoController {
    //
    async all(req, res, next) {
        try {
            const results = await daoRepository.find({
                relations: {
                    statutDao: true,
                    tiers: true,
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const daoAdd = req.body
            if (daoAdd.code == null || daoAdd.code == undefined || daoAdd.designation == null
                || daoAdd.designation == undefined) {
                return res.send({ description: 'error', message: 'Le code ou la désignation du dao n\'est pas renseignée' })
            }

            const tiersFound = await tiersRepository.findOne({
                relations: {
                    typeTiers: true
                },
                where: {
                    id: daoAdd.tiers.id,
                    intitule: daoAdd.tiers.intitule
                }
            })
            if (!tiersFound) return res.send({ description: 'error', message: "Ce client n'exite pas" })
            if (tiersFound.typeTiers.id != 2) return res.send({ description: 'error', message: "Ce tiers n\'est pas un client" })

            const statut = await statutDaoRepository.findOne({
                where: {
                    id: daoAdd.statutDao.id,
                    statut: daoAdd.statutDao.status
                }
            })
            if (!statut) return res.send({ description: 'error', message: "L'objet statutDao n'est pas valide ou n'exite pas" })

            if ((daoAdd.montantAccepte == 0 || daoAdd.montantOffre == 0) && statut.statut == 'GAGNER')
                return res.send({ description: 'error', message: "Le montant de l'offre ou le montant validé ne peut être egal à zéro(0)" })

            const results = await daoRepository.find(
                {
                    where: [
                        { code: daoAdd.code },
                        { designation: daoAdd.designation }
                    ]
                }
            )
            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou désignation renseigné existe déjà pour un dao.' })
            }

            const result = await daoRepository.create(daoAdd)
            const reslts = await daoRepository.save(result)
            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error.deatils })
        }
    }

    async update(req, res, next) {
        try {

            const daoUpdated = req.body
            const daoFond = await daoRepository.findOneBy({ id: daoUpdated.id })
            if (daoFond == null || daoFond == undefined) {
                return res.send({ description: 'error', message: 'Le DAO n\'existe pas' })
            }
            if (daoUpdated.code == null || daoUpdated.code == undefined) {
                return res.send({ description: 'error', message: 'La rubrique code de l\'objet Dao nest pas renseignée' })
            }
            if (daoUpdated.designation == null || daoUpdated.designation == undefined) {
                return res.send({ description: 'error', message: 'La rubrique designation de l\'objet DAO nest pas renseignée' })
            }

            const statut = await statutDaoRepository.findOne({
                where: {
                    id: daoUpdated.statutDao.id,
                    statut: daoUpdated.statutDao.status
                }
            })
            if (!statut) return res.send({ description: 'error', message: "L'objet statutDao n'est pas valide ou n'exite pas" })

            if ((daoUpdated.montantAccepte == 0 || daoUpdated.montantOffre == 0) && statut.statut == 'GAGNER')
            return res.send({ description: 'error', message: "Le montant de l'offre ou le montant validé ne peut être egal à zéro(0)" })

            const tiersFound = await tiersRepository.findOne({
                where: {
                    id: daoUpdated.tiers.id,
                    intitule: daoUpdated.tiers.intitule
                },
                relations:{
                    typeTiers: true
                }
            })
            if (!tiersFound) return res.send({ description: 'error', message: "Ce client n'exite pas" })
            if (tiersFound.typeTiers.id != 2) return res.send({ description: 'error', message: "Ce tiers n\'est pas un client" })

            const results = await daoRepository.find({
                where: [
                    { code: daoUpdated.code, id: Not(daoUpdated.id) },
                    { designation: daoUpdated.designation, id: Not(daoUpdated.id) }
                ]
            })

            if (results.length != 0) {
                return res.send({ description: 'error', message: 'Le code ou designation renseigné existe déjà pour un DAO.' })
            }
            await daoRepository.update({ id: daoUpdated.id }, daoUpdated)
            const reslt = await daoRepository.find({
                where: {
                    id: daoUpdated.id,
                },
                relations: {
                    statutDao: true,
                    tiers: true
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
            const daoFound = await daoRepository.find({
                where: {
                    id: id
                }
            })
            await daoRepository.remove(daoFound)
            return res.send({ description: 'success', data: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allDaoByStatutDao(req, res, next) {
        try {
            const { id } = req.params
            if (!id) return res.send({ description: 'error', message: 'ID renseigné est invalide ou incorrect' })
            const result = await statutDaoRepository.findOneBy({ id: id })
            const results = await daoRepository.find({
                where: {
                    statutDao: result
                },
                relations: {
                    statutDao: true,
                    tiers: true
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allDaoWinWithoutMarche(req, res, next) {
        try {
            const daos = await daoRepository.createQueryBuilder("dao")
                .leftJoinAndSelect("dao.statutDao", "statutDao")
                .leftJoinAndSelect("dao.marche", "marche")
                .where("statutDao.statut = :statut", { "statut": "GAGNER" })
                .getMany()

            const result = []
            daos.forEach(dao => {
                if (!dao.marche) {
                    result.push(dao)
                }
            })
            return res.send({ description: 'success', data: result })

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}