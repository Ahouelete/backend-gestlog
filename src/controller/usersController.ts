//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { rolesUser, User } from "../entity/User";
import { genererJwonWebToken, verifyToken } from "./../jwt.utils"
const bcrypt = require("bcrypt")
//Constantes
const usersRepository = AppDataSource.getRepository(User)

interface credential {
    userNameorEmail: string,
    password: string
}

interface passwordFormat {
    userNameorEmail: string,
    oldPassord: string,
    newPassword: string
}
//Controller
export class UsersController {
    //
    async all(req, res, next) {
        try {
            const results = await usersRepository.find({
                select: {
                    password: false
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async getUserById(req, res, next) {
        try {
            const id = req.body.id
            const results = await usersRepository.findOne({
                select: {
                    password: false,
                    role: false,
                    isAdmin: false
                },
                where: {
                    id: id
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async allUsersByRoles(req, res, next) {
        const { role } = req.params
        try {
            const results = await usersRepository.find({
                where: {
                    role
                },
                select: {
                    password: false
                }
            })
            return res.send({ description: 'success', data: results })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async add(req, res, next) {
        try {
            const usersAdd = req.body
            if (usersAdd.userName == null || usersAdd.userName == undefined ||
                usersAdd.password == null || usersAdd.password == undefined
                || usersAdd.nom == undefined || usersAdd.nom == null
                || usersAdd.prenoms == undefined || usersAdd.prenoms == null
                || usersAdd.email == undefined || usersAdd.email == null) {
                return res.send({ description: 'error', message: 'Un ou plusieurs champs obligatoires sont pas renseignés' })
            }

            if (usersAdd.role == rolesUser.ADMIN || usersAdd.role == rolesUser.UTILISATEUR
                || usersAdd.role == rolesUser.NONE) {
                // execute....
            } else {
                return res.send({ description: 'error', message: 'roles utilisateur invalide ou incorrect' })
            }

            const results = await usersRepository.find(
                {
                    where: [
                        { email: usersAdd.email },
                        { userName: usersAdd.userName }
                    ]
                }
            )
            if (results.length != 0) return res.send({ description: 'error', message: 'Cet utilisateur existe dejà' })
            bcrypt.hash(usersAdd.password, 5, async function (error, passwordCrypted) {

                usersAdd.password = passwordCrypted
                const result = await usersRepository.create(usersAdd)
                const reslt = await usersRepository.save(result)
                return res.send({ description: 'success', data: reslt })

            })
        }

        catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async updateProfile(req, res, next) {

        try {
            const usersUpdated = req.body
            const usersFound = await usersRepository.findOneBy({ id: usersUpdated.id })
            if (usersFound == null || usersFound == undefined) {
                return res.send({ description: 'error', message: 'Cet utilisateur n\'existe pas' })
            }

            if (usersUpdated.userName == null || usersUpdated.userName == undefined
                || usersUpdated.nom == undefined || usersUpdated.nom == null
                || usersUpdated.prenoms == undefined || usersUpdated.prenoms == null
                || usersUpdated.email == undefined || usersUpdated.email == null) {
                return res.send({ description: 'error', message: 'Un ou plusieurs champs obligatoires sont pas renseignés' })
            }
            usersUpdated.role = usersFound.role
            usersUpdated.isAdmin = usersFound.isAdmin

            /*  if (usersUpdated.role != rolesUser.ADMIN && usersUpdated.role != rolesUser.UTILISATEUR
                 || usersUpdated.role != rolesUser.NONE) return res.send({ description: 'error', message: 'roles utilisateur invalide ou incorrect' })
  */
            const results = await usersRepository.find(
                {
                    where: [
                        { email: usersUpdated.email, id: Not(usersUpdated.id) },
                        { userName: usersUpdated.userName, id: Not(usersUpdated.id) }
                    ]
                }
            )
            if (results.length != 0) return res.send({ description: 'error', message: 'Cet utilisateur existe dejà' })

            usersUpdated.password = usersFound.password
            await usersRepository.update({ id: usersUpdated.id }, usersUpdated)
            const reslt = await usersRepository.findOne({
                where: {
                    id: usersUpdated.id
                },
                select: {
                    password: false
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
            const usersFound = await usersRepository.find({
                where: {
                    id: id
                }
            })
            await usersRepository.remove(usersFound)
            return res.send({ description: 'success', message: 'Supprimé avec succes' }).status(200)

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async signIn(req, res, next) {

        try {
            const credential: credential = req.body
            const userFound = await usersRepository.findOne({
                select: {
                    password: true,
                    id: true,
                    isAdmin: true,
                    role: true,
                    userName: true,
                    email: true,
                    nom: true,
                    prenoms: true
                },
                where: [
                    { email: credential.userNameorEmail },
                    { userName: credential.userNameorEmail }
                ]
            })

            if (userFound) {
                bcrypt.compare(credential.password, userFound.password, function (error, same) {
                    if (!same) {
                        return res.send({ description: 'error', message: "Nom d'utilisateur ou mot de passe incorrect" })
                    } else {
                        return res.send({
                            userId: userFound.id,
                            token: genererJwonWebToken(userFound)
                        })
                    }
                })

            } else {
                return res.send({ description: 'error', message: "Nom d'utilisateur ou mot de passe incorrect" })
            }
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
    async me(req, res, next) {
        try {
            const header = req.headers['authorization']
            const token = header.replace('Bearer ', '')

            const decoded = verifyToken(token)
            if (!decoded) return res.send({ description: 'eeror', message: "Not Auhorise" })
            if (decoded.userId) {
                const result = await usersRepository.findOne({
                    where: { id: decoded.id }
                })
                return res.send({ desciption: 'success', data: result })
            } else return res.send({ description: 'error', message: "Not Auhorise" })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async resetPassword(req, res, next) {
        try {
            const resetPasswordObject: passwordFormat = req.body
            const header = req.headers['authorization']
            const token = header.replace('Bearer ', '')

            const decoded = verifyToken(token)
            if (!decoded) return res.send({ description: 'error', message: "Not Auhorise" })

            const userFound = await usersRepository.findOne({
                where: [
                    { email: resetPasswordObject.userNameorEmail },
                    { userName: resetPasswordObject.userNameorEmail }
                ]
            })
            if (!userFound) return res.send({ description: 'error', message: "Nom d\'utilisateur ou mot de passe incorrect" })

            bcrypt.compare(resetPasswordObject.oldPassord, userFound.password, function (error, result) {

                if (!result) return res.send({ description: 'error', message: "Nom d\'utilisateur ou mot de passe incorrect" })

            })

            bcrypt.hash(resetPasswordObject.newPassword, 5, async function (error, crypted) {
                userFound.password = crypted
                await usersRepository.update({ id: userFound.id }, userFound)
                return res.send({ description: 'success', message: 'Mot de passe modifié avec succès' })
            })

        } catch (error) {
            console.log({ description: 'error', message: error });

        }
    }
}
