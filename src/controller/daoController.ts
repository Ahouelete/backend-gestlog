//imports
import { send } from "process";
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Dao } from "../entity/dao";
import { DaoMotifRejet } from "../entity/daoMotifRejet";
import { DaoSoumissionnaire } from "../entity/daoSoumissionaire";
import { MotifRejet } from "../entity/motifDao";
import { PieceJointeDao } from "../entity/pieceJointeDao";
import { PieceDao } from "../entity/piece_dao";
import { Soumissionnaire } from "../entity/soumissionnaire";
import { StatutDao } from "../entity/statutDao";
import { Tiers } from "../entity/tiers";
import { User } from "../entity/User";
import { mkdir, rm } from "fs/promises";
import { writeFile, readFile } from "fs/promises";

const nodemailer = require('nodemailer')

//Constantes
const daoRepository = AppDataSource.getRepository(Dao)
const statutDaoRepository = AppDataSource.getRepository(StatutDao)
const tiersRepository = AppDataSource.getRepository(Tiers)
const pieceJointeDaoRepository = AppDataSource.getRepository(PieceJointeDao)
const pieceDaoRepository = AppDataSource.getRepository(PieceDao)
const motifRejetRepository = AppDataSource.getRepository(MotifRejet)
const daoMotifRejetRepository = AppDataSource.getRepository(DaoMotifRejet)
const soumissionnaireRepository = AppDataSource.getRepository(Soumissionnaire)
const daoSoumissionnaireRepository = AppDataSource.getRepository(DaoSoumissionnaire)
const userRepository = AppDataSource.getRepository(User)
//Controller

/***************************** CONFIGURATION EMAIL ****************************************** */

export enum secure_configuration {
    EMAIL_USERNAME = 'beatrixgestlog@gmail.com',
    PASSWORD = 'Beatrix@2022',
    PASSWORD_SECRET = 'tfpkmvognbnfoqfb',
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: 'true',
    service: 'gmail',
    auth: {
        user: secure_configuration.EMAIL_USERNAME,
        pass: secure_configuration.PASSWORD_SECRET
    }
});

/********************************************************** FIN CONFIGURATION EMAIL *************************************** */

export class DaoController {
    //
    async all(req, res, next) {
        try {
            const results = await daoRepository.find({
                relations: {
                    statutDao: true,
                    tiers: true,
                    pieceJointeDao: {
                        pieceDao: true,
                        dao: true,
                        personneResponsabilise: true
                    },

                    daoSoumissionnaire: {
                        soumissionnaire: true
                    },
                    daoMotifRejet: {
                        motifRejet: true
                    }
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const daoAndPiece = req.body
            const daoAdd = daoAndPiece.dao
            const pieceDaoAdd = daoAndPiece.pieceDao
            const motifRejetDao = daoAdd.daoMotifRejet
            const soumissionnaireDao = daoAdd.daoSoumissionnaire

            if (daoAdd.code == null || daoAdd.code == undefined || daoAdd.designation == null
                || daoAdd.designation == undefined || daoAdd.designationLot == null ||
                daoAdd.designationLot == undefined || daoAdd.nbreLot == null || daoAdd.nbreLot == undefined
                || daoAdd.nbreLot < 1 || daoAdd.dureeValiditeDao == null || daoAdd.dureeValiditeDao == undefined
                || daoAdd.dureeValiditeDao < 1 || daoAdd.daoSoumissionnaire == undefined || daoAdd.daoSoumissionnaire == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques du dao sont pas renseignées' })
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

            const results = await daoRepository.findOne(
                {
                    where: [
                        { code: daoAdd.code },
                        { designation: daoAdd.designation }
                    ]
                }
            )

            if (results) {
                return res.send({ description: 'error', message: 'Le code ou désignation renseigné existe déjà pour un dao.' })
            }

            const result = await daoRepository.create(daoAdd)
            const reslts = await daoRepository.save(result)

            // ENREGISTRE LES MOTIFS DU REJET DU DAO

            if (motifRejetDao) {
                motifRejetDao.forEach(async element => {
                    const reslt = await motifRejetRepository.findOne({
                        where: {
                            id: element.id,
                            motif: element.motif
                        }
                    })

                    if (reslt) {
                        const DaoMotifRejet = {
                            id: null,
                            motifRejet: reslt as any,
                            dao: reslts as any
                        }
                        await daoMotifRejetRepository.create(DaoMotifRejet)
                        await daoMotifRejetRepository.save(DaoMotifRejet)
                    }
                });
            }

            // ENREGISTRE LES SOUMMISSIONNAIRE DU DAO

            if (soumissionnaireDao) {
                soumissionnaireDao.forEach(async element => {
                    const reslt = await soumissionnaireRepository.findOne({
                        where: {
                            id: element.id,
                            numero: element.numero,
                            intitule: element.intitule
                        }
                    })

                    if (reslt) {
                        const daoSoumissionnaire = {
                            id: null,
                            soumissionnaire: reslt as any,
                            dao: reslts as any
                        }
                        await daoSoumissionnaireRepository.create(daoSoumissionnaire)
                        await daoSoumissionnaireRepository.save(daoSoumissionnaire)
                    }
                });
            }

            // ENREGISTRE LES PIECES A FOURNIR ET JOINTES AU DAO

            if (pieceDaoAdd) {
                // CREATION DU DOSSIER DES PIECES JOINTES

                const path = './PIECES_DAO_JOINTES/' + daoAdd.code + '_' + daoAdd.designation + '/'
                await mkdir(path, { recursive: true })

                pieceDaoAdd.forEach(async element => {
                    const reslt = await pieceDaoRepository.findOne({
                        where: {
                            id: element.pieceDao.id,
                            code: element.pieceDao.code,
                            designation: element.pieceDao.designation
                        }
                    })
                    const base64 = element.pieceJointe
                    const typeFile = base64 ? base64.split(";")[0].split('/')[1] : ''
                    const fileName = base64 ? reslt.code + '_' + reslt.designation + '.' + typeFile : null

                    if (reslt) {
                        const pieceJointeDao = {
                            id: null,
                            nbCopie: element.nbCopie,
                            nature: element.nature,
                            estFournie: element.estFournie,
                            estEliminatoire: element.estEliminatoire,
                            estEssentiel: element.estEssentiel,
                            estFacultatif: element.estFacultatif,
                            estLegalise: element.estLegalise,
                            dureeValiditePiece: element.dureeValiditePiece,
                            deadLine: element.deadLine,
                            messageParticulier: element.messageParticulier,
                            personneResponsabilise: element.personneResponsabilise,
                            pieceJointe: fileName,
                            autresInfos: element.autresInfos,
                            pieceDao: element.pieceDao,
                            dao: reslts as any
                        }
                        await pieceJointeDaoRepository.create(pieceJointeDao)
                        await pieceJointeDaoRepository.save(pieceJointeDao)

                        // AJOUT DE LA PIECE JOINTE DANS LE DOSSIER PIECE_DAO_JOINTE
                        if (fileName)
                            await writeFile(path + fileName, base64.split(',')[1], { encoding: 'base64' })
                    }
                });

                // ENVOIE DES E-MAILS POUR CONSTITUTION DES PIECES DU DAO
                let groupByPerson = {}
                pieceDaoAdd.forEach(el => {

                    if (el.personneResponsabilise.email) {

                        if (groupByPerson[el.personneResponsabilise.email]) {
                            groupByPerson[el.personneResponsabilise.email].push(el)
                        } else {
                            groupByPerson[el.personneResponsabilise.email] = []
                            groupByPerson[el.personneResponsabilise.email].push(el)
                        }
                    }
                })

                for (let obj in groupByPerson) {
                    let msg = ""
                    groupByPerson[obj].forEach((element, index) => {
                        // ENVOIE DE MAIL PAR PERSONNE
                        msg = msg + "<br>" + (index + 1) + " - " + element.pieceDao.designation + ' avec validité de ' + element.dureeValiditePiece + 'jours à fournir avant ' + element.deadLine
                        if (groupByPerson[obj].length == index + 1) {
                            const adress = {
                                name: 'GESTLOG Notifications',
                                address: 'beatrixgestlog@gmail.com'
                            }
                            const mailConfigurations = {
                                // It should be a string of sender email
                                from: adress,
                                // Comma Separated list of mails
                                to: obj,
                                // Subject of Email
                                subject: 'Constitution de pièces pour DAO',
                                // This would be the text of email body
                                html: '<h2>Bonjour M./Mme ' + element.personneResponsabilise.nom + ' ' + element.personneResponsabilise.prenoms + '</h2>'
                                    + '<br>Dans le cadre de la constitution des dossiers relatifs au DAO «' + daoAdd.designation
                                    + '», vous voudrez bien vous occuper des pièces ci-après: <br>'
                                    + msg
                                    + '<br><br>J\'attacherai du prix au respect des délais de constitution.'
                                    + '<br><br>Merci pour votre diligence habituelle.'
                            };
                            transporter.sendMail(mailConfigurations, function (error, info) {
                                if (error) console.log(error);
                                //console.log('Email Sent Successfully');
                                //console.log(info);
                            });
                        }
                    });

                }
            }

            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            return res.send({ description: 'error', message: error.deatils })
        }
    }

    /************************************** UPDATE ******************************************** */
    async update(req, res, next) {
        try {

            const daoAndPiece = req.body
            const daoUpdated = daoAndPiece.dao
            const pieceDaoUpdate = daoAndPiece.pieceDao
            const motifRejetDaoUpdate = daoUpdated.daoMotifRejet
            const soumissionnaireDaoUpdate = daoUpdated.daoSoumissionnaire

            if (daoUpdated.code == null || daoUpdated.code == undefined || daoUpdated.designation == null
                || daoUpdated.designation == undefined || daoUpdated.designationLot == null ||
                daoUpdated.designationLot == undefined || daoUpdated.nbreLot == null || daoUpdated.nbreLot == undefined
                || daoUpdated.nbreLot < 1 || daoUpdated.dureeValiditeDao == null || daoUpdated.dureeValiditeDao == undefined
                || daoUpdated.dureeValiditeDao < 1 || daoUpdated.daoSoumissionnaire == undefined || daoUpdated.daoSoumissionnaire == null) {
                return res.send({ description: 'error', message: 'Certaines rubriques du dao sont pas renseignées' })
            }

            const daoFond = await daoRepository.findOneBy({ id: daoUpdated.id })
            if (daoFond == null || daoFond == undefined) {
                return res.send({ description: 'error', message: 'Le DAO n\'existe pas' })
            }
            const statutDaoFound = await statutDaoRepository.findOne({
                where: {
                    id: daoUpdated.statutDao.id,
                    statut: daoUpdated.statutDao.status
                }
            })
            if (!statutDaoFound) return res.send({ description: 'error', message: "L'objet statutDao n'est pas valide ou n'exite pas" })

            if ((daoUpdated.montantAccepte == 0 || daoUpdated.montantOffre == 0) && statutDaoFound.statut == 'GAGNER')
                return res.send({ description: 'error', message: "Le montant de l'offre ou le montant validé ne peut être egal à zéro(0)" })

            const tiersFound = await tiersRepository.findOne({
                where: {
                    id: daoUpdated.tiers.id,
                    intitule: daoUpdated.tiers.intitule
                },
                relations: {
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
            const entity_schema = await daoRepository.create(daoUpdated)
            await daoRepository.save(entity_schema)

            const reslt = await daoRepository.find({
                where: {
                    id: daoUpdated.id,
                },
                relations: {
                    statutDao: true,
                    tiers: true
                }
            })

            // SUPPRIME DES PIECES JOINTES DE CE DAO 
            const daosOfPiece = await pieceJointeDaoRepository.find({
                where: {
                    dao: {
                        id: reslt[0].id
                    }
                }
            })
            if (daosOfPiece) await pieceJointeDaoRepository.remove(daosOfPiece)
            // SUPPRIME DES SOUMMISSIONNAIRES DE CE DAO 
            const oldSoummissionnairesDao = await daoSoumissionnaireRepository.find({
                where: {
                    dao: {
                        id: reslt[0].id
                    }
                }
            })
            if (oldSoummissionnairesDao) await daoSoumissionnaireRepository.remove(oldSoummissionnairesDao)

            // SUPPRIME DES SOUMMISSIONNAIRES DE CE DAO 
            const oldMotifRejetDao = await daoMotifRejetRepository.find({
                where: {
                    dao: {
                        id: reslt[0].id
                    }
                }
            })
            if (oldMotifRejetDao) await daoMotifRejetRepository.remove(oldMotifRejetDao)


            // ENREGISTRE LES MOTIFS DU REJET DU DAO

            if (motifRejetDaoUpdate) {
                motifRejetDaoUpdate.forEach(async element => {
                    const rest = await motifRejetRepository.findOne({
                        where: {
                            id: element.id,
                            motif: element.motif
                        }
                    })

                    if (rest) {
                        const DaoMotifRejet = {
                            id: null,
                            motifRejet: rest as any,
                            dao: reslt[0]
                        }
                        await daoMotifRejetRepository.create(DaoMotifRejet)
                        await daoMotifRejetRepository.save(DaoMotifRejet)
                    }
                });
            }

            // ENREGISTRE LES SOUMMISSIONNAIRE DU DAO

            if (soumissionnaireDaoUpdate) {
                soumissionnaireDaoUpdate.forEach(async element => {
                    const rest = await soumissionnaireRepository.findOne({
                        where: {
                            id: element.id,
                            numero: element.numero,
                            intitule: element.intitule
                        }
                    })

                    if (rest) {
                        const daoSoumissionnaire = {
                            id: null,
                            soumissionnaire: rest as any,
                            dao: reslt[0]
                        }
                        const entity_schema = await daoSoumissionnaireRepository.create(daoSoumissionnaire)
                        await daoSoumissionnaireRepository.save(entity_schema)
                    }
                });
            }

            // ENREGISTRE LES PIECES A FOURNIR ET JOINTES AU DAO

            if (pieceDaoUpdate) {
                // CREATION DU DOSSIER DES PIECES JOINTES
                const path = './PIECES_DAO_JOINTES/' + daoUpdated.code + '_' + daoUpdated.designation + '/'
                //   await rm(path, {recursive: true})
                await mkdir(path, { recursive: true })
                pieceDaoUpdate.forEach(async element => {
                    const rest = await pieceDaoRepository.findOne({
                        where: {
                            id: element.pieceDao.id,
                            code: element.pieceDao.code,
                            designation: element.pieceDao.designation
                        }
                    })
                    const base64 = element.pieceJointe
                    const typeFile = base64 ? base64.split(";")[0].split('/')[1] : ''
                    const fileName = base64 ? rest.code + '_' + rest.designation + '.' + typeFile : null
                    if (rest) {
                        const pieceJointeDao = {
                            id: null,
                            nbCopie: element.nbCopie,
                            nature: element.nature,
                            estFournie: element.estFournie,
                            estEliminatoire: element.estEliminatoire,
                            estEssentiel: element.estEssentiel,
                            estFacultatif: element.estFacultatif,
                            estLegalise: element.estLegalise,
                            dureeValiditePiece: element.dureeValiditePiece,
                            deadLine: element.deadLine,
                            messageParticulier: element.messageParticulier,
                            personneResponsabilise: element.personneResponsabilise,
                            pieceJointe: fileName,
                            autresInfos: element.autresInfos,
                            pieceDao: element.pieceDao,
                            dao: reslt[0] as any
                        }
                        await pieceJointeDaoRepository.create(pieceJointeDao)
                        await pieceJointeDaoRepository.save(pieceJointeDao)

                        // AJOUT DE LA PIECE JOINTE DANS LE DOSSIER PIECE_DAO_JOINTE
                        if (fileName && base64 && !element.id)
                            await writeFile(path + fileName, base64.split(',')[1], { encoding: 'base64' })
                    }
                });
                return res.send({ description: 'success', data: reslt })
            }
        } catch (error) {
            return res.send({ description: 'error', message: error.deatils })
        }
    }
    async downloadFile(req, res, next) {
        try {
            const {pieceJointeID} = req.params
            const pieceJointeFound = await pieceJointeDaoRepository.findOne({
                where: {
                    id: pieceJointeID
                },
                relations: {
                    dao: true
                }
            })
            if (pieceJointeFound) {
                const path = './PIECES_DAO_JOINTES/' + pieceJointeFound.dao.code + '_' + pieceJointeFound.dao.designation + '/'
                const file = await readFile(path + pieceJointeFound.pieceJointe, { encoding: 'base64' })
                //data:image/jpeg;base64,
                const type = pieceJointeFound.pieceJointe.split('.')[1
                ]
                const reslt = 'data:'+type == 'pdf' ? 'application/pdf' : 'image/jpeg' +';base64,'+file
                return res.send({ description: 'success', data: reslt })
            }
            return res.send({ description: 'error', data: null })

        } catch (error) {
            return res.send({ description: 'error', data: null })
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
                    statutDao: {
                        id: result.id
                    }
                },
                relations: {
                    statutDao: true,
                    tiers: true,
                    pieceJointeDao: true
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