// imports
import { AppDataSource } from "../data-source"
import { P_MECEF } from "../entity/p_mecef"
import { P_SOCIETE } from "../entity/p_societe"

//constantes
const pSocieteRepository = AppDataSource.getRepository(P_SOCIETE)

export class P_SOCIETEController {
    //Controller
    async save(req, res, next) {
        try {
            const pSocieteAdd = req.body
            if (pSocieteAdd.adresse == null || pSocieteAdd.adresse == undefined || 
                pSocieteAdd.raisonSociale == null || pSocieteAdd.raisonSociale == undefined )
                return res.send({ description: 'error', message: 'Certaines rubriques obligatoires sont pas renseignées' })

            await pSocieteRepository.save(pSocieteAdd)
            const reslt = await pSocieteRepository.find()
            return res.send({ description: 'success', data: reslt })

        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    // GET ALL type Article
    async getInfoSociete(req, res, next) {
        try {
            const reslt = await pSocieteRepository.find()
            return res.send({ description: 'success', data: reslt })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }
}






