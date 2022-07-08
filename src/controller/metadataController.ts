// imports
import { AppDataSource } from "../data-source"
import { ModeReglement } from "../entity/modeReglement"
import { StatutDao } from "../entity/statutDao"
import { StatutMarche } from "../entity/statutMarche"
import { TypeArticle } from "../entity/typeArticle"
import { TypeCaution } from "../entity/typeCaution"
import { TypeDocument } from "../entity/typeDocument"
import { TypeFinancement } from "../entity/typeFinancement"
import { TypeTiers } from "../entity/typeTiers"

//constantes
const statutDaoObject = [
    {
        id: 1,
        statut: "EN COURS DE CONSTITUTION"
    },
    {
        id: 2,
        statut: "EN COURS D'ETUDE"
    },
    {
        id: 3,
        statut: "DEPOSER"
    },
    {
        id: 4,
        statut: "REJETER"
    },
    {
        id: 5,
        statut: "GAGNER"
    },
    {
        id: 6,
        statut: "ABANDON"
    }
]

const statutMarcheObject = [
    {
        id: 1,
        statut: "EN COURS"
    },
    {
        id: 2,
        statut: "RECEPTION PROVISOIRE"
    },
    {
        id: 3,
        statut: "RECEPTION DEFINITIVE"
    }
]

const typeFinancementObject = [
    {
        id: 1,
        type: "FINANCEMENT MIXTE"
    },
    {
        id: 2,
        type: "FINANCEMENT UNIQUE"
    }
]

const typeCautionObject = [
    {
        id: 1,
        type: "GARANTIE DE SOUMISSION"
    },
    {
        id: 2,
        type: "CAUTION AVANCE DE DEMARRAGE"
    },
    {
        id: 3,
        type: "CAUTION DE BONNE EXECUTION"
    }
]

const typeTiersObject = [
    {
        id: 1,
        type: "FOURNISSEUR"
    },
    {
        id: 2,
        type: "CLIENT"
    },
    {
        id: 3,
        type: "SOUS TRAITANT"
    }
]

const typeArticleObject = [
    {
        id: 1,
        type: "MATERIAUX"
    },
    {
        id: 2,
        type: "MATERIELS"
    },
    {
        id: 3,
        type: "PIECES DE RECHANGES"
    }
]

const modeReglementObject = [
    {
        id: 1,
        intitule: "ESPECES"
    },
    {
        id: 2,
        intitule: "MOBILEMONEY"
    },
    {
        id: 3,
        intitule: "VIREMENT"
    },
    {
        id: 4,
        intitule: "CHEQUES"
    },
    {
        id: 5,
        intitule: "AUTRE"
    },
    {
        id: 6,
        intitule: "CARTEBANCAIRE"
    },
    {
        id: 7,
        intitule: "CREDIT"
    }
]

const typeDocumentObject = [
    {
        id: 1,
        intitule: "DEMANDE",
        doType: 11,
        domain: 1
    },
    {
        id: 2,
        intitule: "DEVIS",
        doType: 12,
        domain: 1
    },
    {
        id: 3,
        intitule: "BON DE COMMANDE",
        doType: 13,
        domain: 1
    },
    {
        id: 4,
        intitule: "BON DE RECEPTION",
        doType: 14,
        domain: 1
    },
    {
        id: 5,
        intitule: "FACTURE",
        doType: 15,
        domain: 1
    },
    {
        id: 6,
        intitule: "FACTURE D'AVOIR",
        doType: 16,
        domain: 1
    },
    {
        id:7 ,
        intitule: "ENTREE",
        doType: 21,
        domain: 2
    },
    {
        id: 8 ,
        intitule: "SORTIE",
        doType: 22,
        domain: 2
    },
    {
        id: 9 ,
        intitule: "TRANSFERT",
        doType: 23,
        domain: 2
    },
    {
        id:10 ,
        intitule: "PRODUCTION",
        doType: 24,
        domain: 2
    },
    {
        id:11 ,
        intitule: "CONSOMMATION",
        doType: 31,
        domain: 3
    }
]

const statutDaoRepository = AppDataSource.getRepository(StatutDao)
const statutMarcheRepository = AppDataSource.getRepository(StatutMarche)
const typeFinancementRepository = AppDataSource.getRepository(TypeFinancement)
const typeCautionRepository = AppDataSource.getRepository(TypeCaution)
const typeDocumentRepository = AppDataSource.getRepository(TypeDocument)
const typeTiersRepository = AppDataSource.getRepository(TypeTiers)
const modeReglementtRepository = AppDataSource.getRepository(ModeReglement)
const typeArticleRepository = AppDataSource.getRepository(TypeArticle)

export class MetaData {
    //Controller
    async add(req, res, next) {
        try {

            // ADD statut DAO
            statutDaoObject.forEach(async s => {
                const statutDao = new StatutDao()
                statutDao.id = s.id
                statutDao.statut = s.statut
                await statutDaoRepository.save(statutDao)
            })
            // ADD statut Marche
            statutMarcheObject.forEach(async s => {
                const statutMarche = new StatutMarche()
                statutMarche.id = s.id
                statutMarche.statut = s.statut
                await statutMarcheRepository.save(statutMarche)
            })
            // ADD type Financement
            typeFinancementObject.forEach(async s => {
                const typeFinancement = new TypeFinancement()
                typeFinancement.id = s.id
                typeFinancement.type = s.type
                await typeFinancementRepository.save(typeFinancement)
            })

            // ADD type Caution
            typeCautionObject.forEach(async s => {
                const typeCaution = new TypeCaution()
                typeCaution.id = s.id
                typeCaution.type = s.type
                await typeCautionRepository.save(typeCaution)
            })

            
            // ADD type Document
            typeDocumentObject.forEach(async s => {
                const typeDocument = new TypeDocument()
                typeDocument.id = s.id
                typeDocument.intitule = s.intitule
                typeDocument.doType = s.doType
                typeDocument.domain = s.domain
                await typeDocumentRepository.save(typeDocument)
            })

            // ADD type Document
            typeTiersObject.forEach(async s => {
                const typeTiers = new TypeTiers()
                typeTiers.id = s.id
                typeTiers.type = s.type
                await typeTiersRepository.save(typeTiers)
            })

              // ADD Mode Reglement
              modeReglementObject.forEach(async s => {
                const modeReglement = new ModeReglement()
                modeReglement.id = s.id
                modeReglement.intitule = s.intitule
                await modeReglementtRepository.save(modeReglement)
            })

            // ADD Type Article
            typeArticleObject.forEach(async s => {
                const typeArticle = new TypeArticle()
                typeArticle.id = s.id
                typeArticle.type = s.type
                await typeArticleRepository.save(typeArticle)
            })

        } catch (error) {
            console.log(error)
        }
    }
    // GET ALL Statut DAO
    async allStatutDao(req, res, next) {
        try {
            const results = await statutDaoRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }
    // GET ALL statut Marche
    async allStatutMarche(req, res, next) {
        try {
            const results = await statutMarcheRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }

    // GET ALL statut Marche
    async allTypeFinancement(req, res, next) {
        try {
            const results = await typeFinancementRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }

    
    // GET ALL type Document
    async allTypeDocument(req, res, next) {
        try {
            const results = await typeDocumentRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }

      // GET ALL type Caution
      async allTypeCaution(req, res, next) {
        try {
            const results = await typeCautionRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }

     // GET ALL type Caution
     async allTypeTiers(req, res, next) {
        try {
            const results = await typeTiersRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }

     // GET ALL type Article
     async allTypeArticle(req, res, next) {
        try {
            const results = await typeArticleRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }

     // GET ALL type Article
     async allModeReglement(req, res, next) {
        try {
            const results = await modeReglementtRepository.find()
            return res.send(results).status(200)
        } catch (error) {
            return res.send(error).status(500)
        }
    }
}






