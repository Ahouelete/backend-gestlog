// imports
import { AppDataSource } from "../data-source"
import { P_MECEF } from "../entity/p_mecef"

//constantes
const pMecefRepository = AppDataSource.getRepository(P_MECEF)

export class P_MECEFController {
    //Controller
    async save(req, res, next) {
        try {
            const pMecefAdd = req.body
            if (pMecefAdd.nim == null || pMecefAdd.nim == undefined || pMecefAdd.contact == null || pMecefAdd.contact == undefined ||
                pMecefAdd.adresse == null || pMecefAdd.adresse == undefined || pMecefAdd.etat == null || pMecefAdd.etat == undefined ||
                pMecefAdd.dateExpJwt == null || pMecefAdd.dateExpJwt == undefined || pMecefAdd.urlApiMECEF == null || pMecefAdd.urlApiMECEF == undefined ||
                pMecefAdd.jwtToken == null || pMecefAdd.jwtToken == undefined)
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont pas renseignées' })

            await pMecefRepository.save(pMecefAdd)
            const reslt = await pMecefRepository.find()
            return res.send({ description: 'success', data: reslt })

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    // GET ALL type Article
    async getInfoMecef(req, res, next) {
        try {
            const reslt = await pMecefRepository.find()
            return res.send({ description: 'success', data: reslt })
        } catch (error) {
             return res.send({ description: 'error', message: error })
        }
    }
}






