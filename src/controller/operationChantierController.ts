//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Entrepot } from "../entity/entrepot";
import { OperationChantier, typeOperation } from "../entity/operationChantier";

//Constantes
const entrepotRepository = AppDataSource.getRepository(Entrepot)
const operationChantierRepository = AppDataSource.getRepository(OperationChantier)


//Controller
export class OperationChantierController {
    //
    async all(req, res, next) {
        try {
            const results = await operationChantierRepository.find({
                relations: {
                    entrepot: true
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }

    async allOperationChantierByEntrepot(req, res, next) {
        try {
            const id = req.params.entrepotId
            const entrepot = await entrepotRepository.findOneBy({ id })
            const results = await operationChantierRepository.find({
                relations: {
                    entrepot: true
                },
                where: {
                    entrepot
                }
            })
            return res.send(results)
        } catch (error) {
            return res.send(error)
        }
    }
    async add(req, res, next) {
        try {

            const operationChantierAdd = req.body
            if (operationChantierAdd.date == null || operationChantierAdd.date == undefined
                || operationChantierAdd.type == null || operationChantierAdd.type == undefined
                || operationChantierAdd.heure == null || operationChantierAdd.heure == undefined) {
                return res.send('Un ou plusieurs champs sont non renseignés')
            }

            if (operationChantierAdd.type !== typeOperation.CLOTURER || operationChantierAdd.type !== typeOperation.FERMER
                || operationChantierAdd.type !== typeOperation.NEANT || operationChantierAdd.type !== typeOperation.OUVERT) {
                return res.send('Ce type operation est invalide ou incorrect')
            }

            const entrepot = await entrepotRepository.findOne({
                where: {
                    id: operationChantierAdd.entrepot.id
                }
            })

            if (!entrepot) return res.send('Le chantier associé à cette operation n\'existe pas')

            if (operationChantierAdd.entrepot.statut == typeOperation.CLOTURER)
                return res.send('Ce chantier est cloturé! Aucunes operations ne peut être éffectuées sur ce chantier.')

            if (operationChantierAdd.entrepot.statut == operationChantierAdd.type || operationChantierAdd.type == typeOperation.NEANT)
                return res.send('Ce chantier a le statut ' + operationChantierAdd.type + ' ! Opération Impossible.')

            const result = await operationChantierRepository.create(operationChantierAdd)
            const reslt = await operationChantierRepository.save(result)
            entrepot.statut = operationChantierAdd.type
            await entrepotRepository.update({ id: entrepot.id }, entrepot)
            return res.send(reslt)
        }

        catch (error) {
            return res.send(error)
        }
    }

    async update(req, res, next) {

        try {
            const operationChantierUpdated = req.body
            if (operationChantierUpdated.date == null || operationChantierUpdated.date == undefined
                || operationChantierUpdated.type == null || operationChantierUpdated.type == undefined
                || operationChantierUpdated.heure == null || operationChantierUpdated.heure == undefined) {
                return res.send('Un ou plusieurs champs sont non renseignés')
            }

            const operationChantierFound = await operationChantierRepository.findOne({
                where: {
                    id: operationChantierUpdated.id
                },
                relations: {
                    entrepot: true
                }
            })
            if (!operationChantierFound) return res.send('Cette operation n\'existe pas pour être modifiée')

            operationChantierUpdated.entrepot = operationChantierFound.entrepot
            await operationChantierRepository.update({ id: operationChantierUpdated.id }, operationChantierUpdated)
            const reslt = await operationChantierRepository.findOne({
                where: {
                    id: operationChantierUpdated.id
                },
                relations: {
                    entrepot: true
                }
            })
            return res.send(reslt)

        } catch (error) {
            return res.send(error)
        }
    }
}