//imports
import express from "express"
import { ArticleController } from "./controller/articleController";
import { CategorieArticleController } from "./controller/categorieArticleController";
import { CategorieTarifaireController } from "./controller/categorieTarifaireController";
import { ChantierController } from "./controller/chantierController";
import { ContratSousTraitantController } from "./controller/contratSousTraitant";
import { DaoController } from "./controller/daoController";
import { DeclarationPanneController } from "./controller/declarationPanneController";
import { EntrepotController } from "./controller/entrepotController";
import { FactureMarcheController } from "./controller/factureMarcheController";
import { FamilleController } from "./controller/familleController";
import { MarcheController } from "./controller/marcheController";
import { MetaData } from "./controller/metadataController";
import { OperationChantierController } from "./controller/operationChantierController";
import { PanneController } from "./controller/panneController";
import { P_MECEFController } from "./controller/pMecefController";
import { P_SOCIETEController } from "./controller/pSocieteController";
import { ReglementFactureMarcheController } from "./controller/reglementFactureMarcheController";
import { TaxeController } from "./controller/taxeController";
import { TiersController } from "./controller/tiersController";
import { UsersController } from "./controller/usersController";



//constantes
const router = express.Router()
const familleController = new FamilleController()
const mecefController = new P_MECEFController()
const metaDataController = new MetaData()
const factureMarcheController = new FactureMarcheController()
const daoController = new DaoController()
const categorieArticleController = new CategorieArticleController()
const categorieTarifaireController = new CategorieTarifaireController()
const panneController = new PanneController()
const declarationPanneController = new DeclarationPanneController()
const contratSousTraitantController = new ContratSousTraitantController()
const chantierController = new ChantierController()
const tiersController = new TiersController()
const entrepotController = new EntrepotController()
const taxeController = new TaxeController()
const operationChantierController = new OperationChantierController()
const usersController = new UsersController()
const articleController = new ArticleController()
const marcheController = new MarcheController()
const reglementFactureMarcheController = new ReglementFactureMarcheController
const societeController = new P_SOCIETEController()

//Gestionnaires routes pour api
exports.apiRouter = (function () {

  //******ROUTES POUR API GESTION DES FACTURES MARCHES */
  /**
   * @swagger
   * tags:
   *  name: Facture Marche
   *  description: API de gestion des factures de marchés
   */
  /**
   * @swagger
   * /api/facturemarche/all:
   *  get:
   *      summary: Retourne la liste des factures
   *      description: Retourne la liste des factures
   *      tags: [Facture Marche]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/FactureMarche'
   */
  router.route('/api/facturemarche/all').get(factureMarcheController.all)
  /**
    * @swagger
    * /api/facturemarche/printInvoice:
    *  post:
    *      summary: Imprimer une facture pour un marché
    *      description: Imprimer une facture pour un marché
    *      tags: [Facture Marche]
    *      parameters:
    *          - in: body
    *            name: Facture Marché
    *            required: true
    *            schema: 
    *              type: object
    *              $ref: '#/definitions/FactureMarche'
    *      responses:
    *          200:
    *              description: Success
    *              schema:
    *                  type: object
    *                  $ref: '#/definitions/FactureMarche'
    */
  router.route('/api/facturemarche/printInvoice').post(factureMarcheController.printInvoice)

  router.route('/api/info-mecef/save').post(mecefController.save)

  router.route('/api/info-mecef/get').get(mecefController.getInfoMecef)

  router.route('/api/info-societe/save').post(societeController.save)

  router.route('/api/info-societe/get').get(societeController.getInfoSociete)
  /**
   * @swagger
   * /api/facturemarche/generate:
   *  post:
   *      summary: Generer une facture pour un marché
   *      description: Generer une facture pour un marché
   *      tags: [Facture Marche]
   *      parameters:
   *          - in: body
   *            name: Facture Marché
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/FactureMarche'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/FactureMarche'
   */
  router.route('/api/facturemarche/generate').post(factureMarcheController.generateFacture)

  /**
  * @swagger
  * /api/facturemarche/normaliserfacture:
  *  put:
  *      summary: Normaliser une facture pour un marché
  *      description: Normaliser une facture pour un marché
  *      tags: [Facture Marche]
  *      parameters:
  *          - in: body
  *            name: Facture Marché
  *            required: true
  *            schema: 
  *              type: object
  *              $ref: '#/definitions/FactureMarche'
  *      responses:
  *          200:
  *              description: Success
  *              schema:
  *                  type: object
  *                  $ref: '#/definitions/FactureMarche'
  */
  router.route('/api/facturemarche/normaliserfacture').put(factureMarcheController.normaliserFacture)


  //******ROUTES POUR API GESTION DES REGLEMENTS FACTURES MARCHES */
  /**
   * @swagger
   * tags:
   *  name: Reglement Facture Marche
   *  description: API de gestion des factures de marchés
   */
  /**
   * @swagger
   * /api/reglementfacturemarche/regler-facture:
   *  post:
   *      summary: Regler une facture pour un marché
   *      description: Regler une facture por un marché
   *      tags: [Reglement Facture Marche]
   *      parameters:
   *          - in: body
   *            name: Reglement Facture
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/ReglementFactureMarche'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/FactureMarche'
   */
  router.route('/api/reglementfacturemarche/regler-facture').post(reglementFactureMarcheController.addReglementFactureMarche)

  /**
   * @swagger
   * /api/reglementfacturemarche/all/{clientId}/{statutInvoice}:
   *  get:
   *      summary: Liste des reglements clients
   *      description: Liste des reglements clients
   *      tags: [Reglement Facture Marche]
   *      parameters:
   *          - in: path
   *            name: clientId
   *            required: true
   *            type: string
   *          - in: path
   *            name: statutInvoice
   *            required: true
   *            type: string
   *            
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/reglementfacturemarche/all/:clientId/:statutInvoice').get(reglementFactureMarcheController.allInvoiceReglement)

  /**
  * @swagger
  * /api/reglementfacturemarche/allClientInvoice:
  *  get:
  *      summary: Liste des clients ayant aumoins une facture
  *      description:  Liste des clients ayant aumoins une facture
  *      tags: [Reglement Facture Marche]
  *            
  *      responses:
  *          200:
  *              description: Success
  *              type: object
  */
  router.route('/api/reglementfacturemarche/allClientInvoice').get(reglementFactureMarcheController.allClientInvoice)


  //******ROUTES POUR API GESTION LES FAMILLES DARTICLES */
  /**
   * @swagger
   * tags:
   *  name: Famille
   *  description: API de gestion des familles d'articles
   */
  /**
   * @swagger
   * /api/famille/all:
   *  get:
   *      summary: Retourne la liste des familles d'articles
   *      description: Retourne la liste des familles d'articles
   *      tags: [Famille]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/Famille'
   */
  router.route('/api/famille/all').get(familleController.all)


  /**
   * @swagger
   * /api/famille/add:
   *  post:
   *      summary: Enregistrer une nouvelle famille d'article
   *      description: Enregistrer une nouvelle famille d'article
   *      tags: [Famille]
   *      parameters:
   *          - in: body
   *            name: Famille
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Famille'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Famille'
   */
  router.route('/api/famille/add').post(familleController.add)

  /**
   * @swagger
   * /api/famille/update:
   *  put:
   *      summary: Modifier une famille d'article
   *      description: Modifier une famille d'article
   *      tags: [Famille]
   *      parameters:
   *          - in: body
   *            name: Famille
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Famille'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Famille'
   */
  router.route('/api/famille/update').put(familleController.update)


  /**
   * @swagger
   * /api/famille/delete/{id}:
   *  delete:
   *      summary: Supprimer une famille d'article
   *      description: Supprimer une famille d'article
   *      tags: [Famille]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/famille/delete/:id').delete(familleController.delete)


  //******ROUTES POUR API GESTION DES CONTRATS DES SOUS TRAITANTS */
  /**
   * @swagger
   * tags:
   *  name: Contrat des sous traitants
   *  description: API de gestion des Contrat des sous traitants
   */
  /**
   * @swagger
   * /api/contrat-sous-traitant/all:
   *  get:
   *      summary: Retourne la liste Contrat des sous traitants
   *      description: Retourne la liste Contrat des sous traitants
   *      tags: [Contrat des sous traitants]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/ContratSousTraitant'
   */
  router.route('/api/contrat-sous-traitant/all').get(contratSousTraitantController.all)

  /**
   * @swagger
   * /api/contrat-sous-traitant/add:
   *  post:
   *      summary: Enregistrer un Contrat
   *      description: nregistrer un contrat
   *      tags: [Contrat des sous traitants]
   *      parameters:
   *          - in: body
   *            name: Contrat
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/ContratSousTraitant'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/ContratSousTraitant'
   */
  router.route('/api/contrat-sous-traitant/add').post(contratSousTraitantController.add)

  /**
   * @swagger
   * /api/contrat-sous-traitant/update:
   *  put:
   *      summary: Modifier un contrat
   *      description: Modifier un contrat
   *      tags: [Contrat des sous traitants]
   *      parameters:
   *          - in: body
   *            name: Contrat
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/ContratSousTraitant'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/ContratSousTraitant'
   */
  router.route('/api/contrat-sous-traitant/update').put(contratSousTraitantController.update)


  /**
   * @swagger
   * /api/contrat-sous-traitant/delete/{id}:
   *  delete:
   *      summary: Supprimer un contrat
   *      description: Supprimer un contrat
   *      tags: [Contrat des sous traitants]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/contrat-sous-traitant/delete/:id').delete(contratSousTraitantController.delete)

  //******ROUTES POUR API GESTION DES CHANTIERS */
  /**
   * @swagger
   * tags:
   *  name: Chantiers
   *  description: API de gestion des chantiers
   */
  /**
   * @swagger
   * /api/chantier/all:
   *  get:
   *      summary: Retourne la liste des Chantiers
   *      description: Retourne la liste des Chantiers
   *      tags: [Chantiers]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/Chantier'
   */
  router.route('/api/chantier/all').get(chantierController.all)

  router.route('/api/chantier/allChantierEnCours').get(chantierController.allGetChantiersEnCours)
  /**
   * @swagger
   * /api/chantier/add:
   *  post:
   *      summary: Enregistrer une nouveau chantier
   *      description: nregistrer une nouveau chantier
   *      tags: [Chantiers]
   *      parameters:
   *          - in: body
   *            name: Chantier
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Chantier'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Chantier'
   */
  router.route('/api/chantier/add').post(chantierController.add)

  /**
   * @swagger
   * /api/chantier/update:
   *  put:
   *      summary: Modifier un chantier
   *      description: Modifier un chantier
   *      tags: [Chantiers]
   *      parameters:
   *          - in: body
   *            name: Chantier
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Chantier'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Chantier'
   */
  router.route('/api/chantier/update').put(chantierController.update)


  /**
   * @swagger
   * /api/chantier/delete/{id}:
   *  delete:
   *      summary: Supprimer un chantier
   *      description: Supprimer un chantier
   *      tags: [Chantiers]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/chantier/delete/:id').delete(chantierController.delete)


  //******ROUTES POUR API GESTION LES ARTICLES */
  /**
   * @swagger
   * tags:
   *  name: Article
   *  description: API de gestion des articles
   */
  /**
   * @swagger
   * /api/article/all:
   *  get:
   *      summary: Retourne la liste des articles
   *      description: Retourne la liste des articles
   *      tags: [Article]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/Article'
   */
  router.route('/api/article/all').get(articleController.all)

  /**
* @swagger
* /api/article/allByCategorie/{categorieId}:
*  get:
*      summary: Retourne la liste des articles par categorie article
*      description: Retourne la liste des articles par categorie article
*      tags: [Article]
*      responses:
*          200:
*              description: Success
*              schema:
*                  type: array
*                  $ref: '#/definitions/Article'
*/
  router.route('/api/article/allByCategorie/:categorieId').get(articleController.allArticleByCategorie)

  /**
  * @swagger
  * /api/article/allByType/{typeId}:
  *  get:
  *      summary: Retourne la liste des articles par type article
  *      description: Retourne la liste des articles par type article
  *      tags: [Article]
  *      responses:
  *          200:
  *              description: Success
  *              schema:
  *                  type: array
  *                  $ref: '#/definitions/Article'
  */
  router.route('/api/article/allByType/:typeId').get(articleController.allArticleByTypeArticle)

  /**
  * @swagger
  * /api/article/allByFamille/{familleId}:
  *  get:
  *      summary: Retourne la liste des articles par categorie article
  *      description: Retourne la liste des articles par categorie article
  *      tags: [Article]
  *      responses:
  *          200:
  *              description: Success
  *              schema:
  *                  type: array
  *                  $ref: '#/definitions/Article'
  */
  router.route('/api/article/allByFamille/:familleId').get(articleController.allArticleByFamille)


  /**
* @swagger
* /api/article/allByStatut/{statut}:
*  get:
*      summary: Retourne la liste des articles par statut
*      description: Retourne la liste des articles par statut
*      tags: [Article]
*      responses:
*          200:
*              description: Success
*              schema:
*                  type: array
*                  $ref: '#/definitions/Article'
*/
  router.route('/api/article/allByStatut/:statut').get(articleController.allArticleByStatut)

  /**
   * @swagger
   * /api/article/add:
   *  post:
   *      summary: Enregistrer une nouvel article
   *      description: Enregistrer une nouvel article
   *      tags: [Article]
   *      parameters:
   *          - in: body
   *            name: Article
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Article'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Article'
   */
  router.route('/api/article/add').post(articleController.add)

  /**
   * @swagger
   * /api/article/update:
   *  put:
   *      summary: Modifier un article
   *      description: Modifier un article
   *      tags: [Article]
   *      parameters:
   *          - in: body
   *            name: Famille
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Article'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Article'
   */
  router.route('/api/article/update').put(articleController.update)

  /**
   * @swagger
   * /api/article/delete/{id}:
   *  delete:
   *      summary: Supprimer un article
   *      description: Supprimer un article
   *      tags: [Article]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/article/delete/:id').delete(articleController.delete)

  //******ROUTES POUR API GESTION DES PANNES */
  /**
   * @swagger
   * tags:
   *  name: Panne
   *  description: API de gestion des pannes
   */
  /**
   * @swagger
   * /api/panne/all:
   *  get:
   *      summary: Retourne la liste des panne
   *      description: Retourne la liste des panne
   *      tags: [Panne]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/panne'
   */
  router.route('/api/panne/all').get(panneController.all)

  /**
   * @swagger
   * /api/panne/add:
   *  post:
   *      summary: Enregistrer une nouvelle panne
   *      description: Enregistrer une nouvelle panne
   *      tags: [Panne]
   *      parameters:
   *          - in: body
   *            name: Panne
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Panne'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Panne'
   */
  router.route('/api/panne/add').post(panneController.add)

  /**
   * @swagger
   * /api/panne/update:
   *  put:
   *      summary: Modifier une panne
   *      description: Modifier une panne
   *      tags: [Panne]
   *      parameters:
   *          - in: body
   *            name: Panne
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Panne'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Panne'
   */
  router.route('/api/panne/update').put(panneController.update)


  /**
   * @swagger
   * /api/panne/delete/{id}:
   *  delete:
   *      summary: Supprimer une panne
   *      description: Supprimer une panne
   *      tags: [Panne]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/panne/delete/:id').delete(panneController.delete)


  //******ROUTES POUR API GESTION DES DECLARATION PANNES */
  /**
   * @swagger
   * tags:
   *  name: Declaration Panne
   *  description: API de gestion des declaration pannes
   */
  /**
   * @swagger
   * /api/declarationpanne/all:
   *  get:
   *      summary: Retourne la liste des declaration panne
   *      description: Retourne la liste des declaration panne
   *      tags: [Declaration Panne]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/DeclarationPanne'
   */
  router.route('/api/declarationpanne/all').get(declarationPanneController.all)

  /**
   * @swagger
   * /api/declarationpanne/add:
   *  post:
   *      summary: Enregistrer une nouvelle declaration panne
   *      description: Enregistrer une nouvelle declaration panne
   *      tags: [Declaration Panne]
   *      parameters:
   *          - in: body
   *            name: DeclarationPanne
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/DeclarationPanne'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/DeclarationPanne'
   */
  router.route('/api/declarationpanne/add').post(declarationPanneController.add)

  /**
   * @swagger
   * /api/declarationpanne/update:
   *  put:
   *      summary: Modifier une declaration panne
   *      description: Modifier une declaration panne
   *      tags: [Declaration Panne]
   *      parameters:
   *          - in: body
   *            name: DeclarationPanne
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/DeclarationPanne'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/DeclarationPanne'
   */
  router.route('/api/declarationpanne/update').put(declarationPanneController.update)


  /**
   * @swagger
   * /api/declarationpanne/delete/{id}:
   *  delete:
   *      summary: Supprimer une declaration panne
   *      description: Supprimer une declaration panne
   *      tags: [Declaration Panne]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/declarationpanne/delete/:id').delete(declarationPanneController.delete)

  /**
  * @swagger
  * /api/declarationpanne/Bypanne/{panneId}:
  *  get:
  *      summary:  Retourne la liste des declaration par panne
  *      description: Retourne la liste des declaration par panne
  *      tags: [Declaration Panne]
  *      parameters:
  *          - in: path
  *            name: panneId
  *            required: true
  *            type: number
  *      responses:
  *          200:
  *              description: Success
  *              type: array
  *              schema:
  *                 type: object
  *                 $ref: '#/definitions/DeclarationPanne'
  */
  router.route('/api/declarationpanne/Bypanne/:panneId').get(declarationPanneController.allDeclarationByPanne)

  //******ROUTES POUR API GESTION DES TIERS */
  /**
   * @swagger
   * tags:
   *  name: Tiers
   *  description: API de gestion des tiers
   */
  /**
   * @swagger
   * /api/tiers/all:
   *  get:
   *      summary: Retourne la liste des tiers
   *      description: Retourne la liste des tiers
   *      tags: [Tiers]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/Tiers'
   */
  router.route('/api/tiers/all').get(tiersController.all)

  /**
   * @swagger
   * /api/tiers/add:
   *  post:
   *      summary: Enregistrer un nouveau tiers
   *      description: Enregistrer un nouveau tiers
   *      tags: [Tiers]
   *      parameters:
   *          - in: body
   *            name: Tiers
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Tiers'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Tiers'
   */
  router.route('/api/tiers/add').post(tiersController.add)

  /**
   * @swagger
   * /api/tiers/update:
   *  put:
   *      summary: Modifier un tiers
   *      description: Modifier un tiers
   *      tags: [Tiers]
   *      parameters:
   *          - in: body
   *            name: Tiers
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Tiers'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Tiers'
   */
  router.route('/api/tiers/update').put(tiersController.update)


  /**
   * @swagger
   * /api/tiers/delete/{id}:
   *  delete:
   *      summary: Supprimer un tiers
   *      description: Supprimer un tiers
   *      tags: [Tiers]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/tiers/delete/:id').delete(tiersController.delete)


  /**
  * @swagger
  * /api/tiers/byTypeTiers/{typeTiersId}:
  *  get:
  *      summary:  Retourne la liste des tiers par type
  *      description: Retourne la liste des tiers par type
  *      tags: [Tiers]
  *      parameters:
  *          - in: path
  *            name: typeTiersId
  *            required: true
  *            type: number
  *      responses:
  *          200:
  *              description: Success
  *              type: array
  *              schema:
  *                 type: object
  *                 $ref: '#/definitions/Tiers'
  */
  router.route('/api/tiers/byTypeTiers/:typeTiersId').get(tiersController.allTiersByTypeTiers)

  //******ROUTES POUR API GESTION DES UTILISATEURS */
  /**
   * @swagger
   * tags:
   *  name: Users
   *  description: API de gestion des utilisateurs
   */
  /**
   * @swager
   * tags:
   *  name: AuthController
   *  description: API de gestion d'authentification
   */
  /**
   * @swagger
   * /api/users/all:
   *  get:
   *      summary: Retourne la liste des utilisateurs
   *      description: Retourne la liste des utilisateurs
   *      tags: [Users]
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   */
  router.route('/api/users/all').get(usersController.all)

  /**
  * @swagger
  * /api/auth/signIn:
  *   post:
  *       summary: Se connecter
  *       description: Se connecter
  *       tags: [AuthController]
  *       parameters:
  *           - in: body
  *             type: object
  *             required: true
  *             name: credential
  *             schema:
  *               type: object
  *               properties:
  *                   userNameorEmail:
  *                       type: string
  *                       description: Username ou email
  *                   password: 
  *                       type: string
  *                       description: password user
  *       responses:
  *           200:
  *               description: Success
  *               type: object
  */
  router.route('/api/auth/signIn').post(usersController.signIn)

  /**
   * @swagger
   * /api/auth/me:
   *  get:
   *      summary: Renvoie l'utilisateur connecte
   *      description: Renvoie l'utilisateur connecté
   *      tags: [AuthController]
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/auth/me').get(usersController.me)

  /**
   * @swagger
   * /api/auth/reset-password:
   *  post:
   *      summary: Modifier mot de passe utilisateur
   *      description: Modifier mot de passe utilisateur
   *      tags: [AuthController]
   *      parameters:
   *          - in: body
   *            name: resetObject
   *            required: true
   *            schema:
   *              type: object
   *              properties:
   *                  userNameorEmail: 
   *                      type: string
   *                  oldPassword:
   *                      type: string
   *                  newPassword:
   *                      type: string 
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/auth/reser-password').post(usersController.resetPassword)

  /**
  * @swagger
  * /api/users/allByRole/{role}:
  *  get:
  *      summary: Retourne la liste des utilisateurs par role
  *      description: Retourne la liste des utilisateurs par role
  *      tags: [Users]
  *      parameters:
  *          - in: path
  *            name: role
  *            type: string
  *            required: true
  *      responses:
  *          200:
  *              description: Success
  *              type: array
  */
  router.route('/api/users/allByRole/:role').get(usersController.allUsersByRoles)

  /**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: Retourne l'utilisateur correspondant a l'id
 *      description: Retourne l'utilisateur correspondant a l'id
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            type: number
 *            required: true
 *      responses:
 *          200:
 *              description: Success
 *              type: object
 */
  router.route('/api/users/:role').get(usersController.getUserById)

  /**
   * @swagger
   * /api/users/add:
   *  post:
   *      summary: Enregistrer un nouvel utilisateur
   *      description: Enregistrer un nouvel utilisateur
   *      tags: [Users]
   *      parameters:
   *          - in: body
   *            name: User
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/User'
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/users/add').post(usersController.add)

  /**
   * @swagger
   * /api/users/update-profile:
   *  put:
   *      summary: Modifier un utilisateur
   *      description: Modifier un utilisateur
   *      tags: [Users]
   *      parameters:
   *          - in: body
   *            name: User
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/User'
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/users/update-profile').put(usersController.updateProfile)


  /**
   * @swagger
   * /api/users/delete/{id}:
   *  delete:
   *      summary: Supprimer un utilisateur
   *      description: Supprimer un utilisateur
   *      tags: [Users]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/users/delete/:id').delete(usersController.delete)

  //******ROUTES POUR API GESTION LES CATEGORIES TARIFAIRES */
  /**
   * @swagger
   * tags:
   *  name: Categorie Tarifaire
   *  description: API de gestion des categorie tarifaire
   */
  /**
   * @swagger
   * /api/categorietarifaire/all:
   *  get:
   *      summary: Retourne la liste des categories tarifaires
   *      description: Retourne la liste des categories tarifaires
   *      tags: [Categorie Tarifaire]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/CategorieTarifaire'
   */
  router.route('/api/categorietarifaire/all').get(categorieTarifaireController.all)

  /**
   * @swagger
   * /api/categorietarifaire/add:
   *  post:
   *      summary: Enregistrer une nouvelle categorie Tarifaire
   *      description: Enregistrer une nouvelle categorie Tarifaire
   *      tags: [Categorie Tarifaire]
   *      parameters:
   *          - in: body
   *            name: CategorieTarifaire
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/CategorieTarifaire'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/CategorieTarifaire'
   */
  router.route('/api/categorietarifaire/add').post(categorieTarifaireController.add)

  /**
   * @swagger
   * /api/categorietarifaire/update:
   *  put:
   *      summary: Modifier une categorie tarifaire
   *      description: Modifier une categorie tarifaire
   *      tags: [Categorie Tarifaire]
   *      parameters:
   *          - in: body
   *            name: CategorieTarifaire
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/CategorieTarifaire'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/CategorieTarifaire'
   */
  router.route('/api/categorietarifaire/update').put(categorieTarifaireController.update)


  /**
   * @swagger
   * /api/categorietarifaire/delete/{id}:
   *  delete:
   *      summary: Supprimer une categorie tarifaire
   *      description: Supprimer une categorie tarifaire
   *      tags: [Categorie Tarifaire]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/categorietarifaire/delete/:id').delete(categorieTarifaireController.delete)


  //******ROUTES POUR API GESTION DES TAXES */
  /**
   * @swagger
   * tags:
   *  name: Taxe
   *  description: API de gestion des taxes
   */
  /**
   * @swagger
   * /api/taxe/all:
   *  get:
   *      summary: Retourne la liste des taxes
   *      description: Retourne la liste des taxes
   *      tags: [Taxe]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/Taxe'
   */
  router.route('/api/taxe/all').get(taxeController.all)

  /**
  * @swagger
  * /api/taxe/allBySens/{sens}:
  *  get:
  *      summary: Retourne la liste des taxes par sens
  *      description: Retourne la liste des taxes par sens
  *      tags: [Taxe]
  *      parameters:
  *          - in : path
  *            type: number
  *            name: sens
  *            description: sens 
  *            required: true
  *      responses:
  *          200:
  *              description: Success
  *              schema:
  *                  type: array
  *                  $ref: '#/definitions/Taxe'
  */
  router.route('/api/taxe/allBySens/:sens').get(taxeController.allTaxeBySens)

  /**
   * @swagger
   * /api/taxe/add:
   *  post:
   *      summary: Enregistrer une taxe
   *      description: Enregistrer une taxe
   *      tags: [Taxe]
   *      parameters:
   *          - in: body
   *            name: Taxe
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Taxe'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Taxe'
   */
  router.route('/api/taxe/add').post(taxeController.add)

  /**
   * @swagger
   * /api/taxe/update:
   *  put:
   *      summary: Modifier une taxe
   *      description: Modifier une taxe
   *      tags: [Taxe]
   *      parameters:
   *          - in: body
   *            name: Entrepot
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Taxe'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Taxe'
   */
  router.route('/api/taxe/update').put(taxeController.update)

  /**
   * @swagger
   * /api/taxe/delete/{id}:
   *  delete:
   *      summary: Supprimer une taxe
   *      description: Supprimer une taxe
   *      tags: [Taxe]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/taxe/delete/:id').delete(taxeController.delete)


  //******ROUTES POUR API GESTION DES OPERATIONS CHANTIERS */
  /**
   * @swagger
   * tags:
   *  name: Operation Chantier
   *  description: API de gestion des operations chantiers
   */
  /**
   * @swagger
   * /api/operationchantier/all:
   *  get:
   *      summary: Retourne la liste des operation chantiers
   *      description: Retourne la liste des operations chantiers
   *      tags: [Operation Chantier]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/OperationChantier'
   */
  router.route('/api/operationchantier/all').get(operationChantierController.all)

  /**
  * @swagger
  * /api/operationchantier/allByEntrepot/{entrepotId}:
  *  get:
  *      summary: Retourne la liste des operations chantiers par entrepots
  *      description: Retourne la liste des operations chantiers par entrepots
  *      tags: [Operation Chantier]
  *      parameters:
  *          - in : path
  *            type: number
  *            name: entrepotId
  *            description: id entrepot 
  *            required: true
  *      responses:
  *          200:
  *              description: Success
  *              schema:
  *                  type: array
  *                  $ref: '#/definitions/OperationChantier'
  */
  router.route('/api/operationchantier/allByEntrepot/:entrepotId').get(operationChantierController.allOperationChantierByEntrepot)

  /**
   * @swagger
   * /api/operationchantier/add:
   *  post:
   *      summary: Enregistrer une Operation pour un chantier
   *      description: Enregistrer une operation Chantier
   *      tags: [Operation Chantier]
   *      parameters:
   *          - in: body
   *            name: OperationChantier
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/OperationChantier'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/OperationChantier'
   */
  router.route('/api/operationchantier/add').post(operationChantierController.add)

  /**
   * @swagger
   * /api/operationchantier/update:
   *  put:
   *      summary: Modifier une operation pour un chantier
   *      description: Modifier une operation pour u chantier
   *      tags: [Operation Chantier]
   *      parameters:
   *          - in: body
   *            name: OperationChantier
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/OperationChantier'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/OperationChantier'
   */
  router.route('/api/operationchantier/update').put(operationChantierController.update)

  //******ROUTES POUR API GESTION DES ENTREPOTS OU CHANTIERS */
  /**
   * @swagger
   * tags:
   *  name: Entrepot/Chantier
   *  description: API de gestion des entrepots
   */
  /**
   * @swagger
   * /api/entrepot/all:
   *  get:
   *      summary: Retourne la liste des entrepots
   *      description: Retourne la liste des entrepots
   *      tags: [Entrepot/Chantier]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/Entrepot'
   */
  router.route('/api/entrepot/all').get(entrepotController.all)

  /**
  * @swagger
  * /api/entrepot/allByTiers/{tiersId}:
  *  get:
  *      summary: Retourne la liste des entrepots par tiers
  *      description: Retourne la liste des entrepots par tiers
  *      tags: [Entrepot/Chantier]
  *      parameters:
  *          - in : path
  *            type: number
  *            name: tiersId
  *            description: id tiers 
  *            required: true
  *      responses:
  *          200:
  *              description: Success
  *              schema:
  *                  type: array
  *                  $ref: '#/definitions/Entrepot'
  */
  router.route('/api/entrepot/allByTiers/:tiersId').get(entrepotController.allEntrepotByTiers)

  /**
   * @swagger
   * /api/entrepot/add:
   *  post:
   *      summary: Enregistrer un entrepot
   *      description: Enregistrer un entrepot
   *      tags: [Entrepot/Chantier]
   *      parameters:
   *          - in: body
   *            name: Entrepot
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/Entrepot'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Entrepot'
   */
  router.route('/api/entrepot/add').post(entrepotController.add)

  /**
   * @swagger
   * /api/entrepot/update:
   *  put:
   *      summary: Modifier un entrepot
   *      description: Modifier un entrepot
   *      tags: [Entrepot/Chantier]
   *      parameters:
   *          - in: body
   *            name: Entrepot
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Entrepot'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Entrepot'
   */
  router.route('/api/entrepot/update').put(entrepotController.update)


  /**
   * @swagger
   * /api/entrepot/delete/{id}:
   *  delete:
   *      summary: Supprimer un entrepot
   *      description: Supprimer un entrepot
   *      tags: [Entrepot/Chantier]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/entrepot/delete/:id').delete(entrepotController.delete)


  //******ROUTES POUR API GESTION LES CATEGORIES DARTICLES */
  /**
   * @swagger
   * tags:
   *  name: Categorie Article
   *  description: API de gestion des categorie d'articles
   */
  /**
   * @swagger
   * /api/categoriearticle/all:
   *  get:
   *      summary: Retourne la liste des categorie d'articles
   *      description: Retourne la liste des categorie d'articles
   *      tags: [Categorie Article]
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: array
   *                  $ref: '#/definitions/CategorieArticle'
   */
  router.route('/api/categoriearticle/all').get(categorieArticleController.all)

  /**
   * @swagger
   * /api/categoriearticle/add:
   *  post:
   *      summary: Enregistrer une nouvelle categorie d'article
   *      description: Enregistrer une nouvelle categorie d'article
   *      tags: [Categorie Article]
   *      parameters:
   *          - in: body
   *            name: CategorieArticle
   *            required: true
   *            schema: 
   *              type: object
   *              $ref: '#/definitions/CategorieArticle'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/CategorieArticle'
   */
  router.route('/api/categoriearticle/add').post(categorieArticleController.add)

  /**
   * @swagger
   * /api/categoriearticle/update:
   *  put:
   *      summary: Modifier une categorie d'article
   *      description: Modifier une categorie d'article
   *      tags: [Categorie Article]
   *      parameters:
   *          - in: body
   *            name: CategorieArticle
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/CategorieArticle'
   *      responses:
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/CategorieArticle'
   */
  router.route('/api/categoriearticle/update').put(categorieArticleController.update)


  /**
   * @swagger
   * /api/categoriearticle/delete/{id}:
   *  delete:
   *      summary: Supprimer une categorie d'article
   *      description: Supprimer une categorie d'article
   *      tags: [Categorie Article]
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/categoriearticle/delete/:id').delete(categorieArticleController.delete)

  //** ROUTES API POUR LA GESTION DES DAO */

  /**
   * @swagger
   * tags: 
   *  name: DAO
   *  description: API pour la gestion des DAO
   */

  /**
   * @swagger
   * /api/dao/allDaoWinWithoutMarche:
   *  get:
   *      description: Retourne la liste des daos gagner sans associé à un marché 
   *      summary: Retourne la liste des daos gagner sans associé à un marché
   *      tags: [DAO]
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                 type: object
   *                 $ref: '#/definitions/Dao'
   */
  router.route('/api/dao/allDaoWinWithoutMarche').get(daoController.allDaoWinWithoutMarche)

  /**
   * @swagger
   * /api/dao/all:
   *  get:
   *      description: Retourne la liste des daos
   *      summary: Retourne la liste des daos
   *      tags: [DAO]
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                 type: object
   *                 $ref: '#/definitions/Dao'
   */
  router.route('/api/dao/all').get(daoController.all)

  /**
   * @swagger
   * /api/dao/add:
   *  post:
   *      description: Enregistrer une nouveau DAO
   *      summary: Enregistrer un nouveau DAO
   *      tags: [DAO]
   *      parameters:
   *          - in : body
   *            name: Dao
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Dao'
   *      responses:  
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Dao'
   */
  router.route('/api/dao/add').post(daoController.add)

  /**
   * @swagger
   * /api/dao/statutdao/{id}:
   *  get:
   *      description: Retourne la liste des dao par StatutDao
   *      summary: Retourne la liste des dao par StatutDao
   *      tags: [DAO]
   *      parameters:
   *          - in: path
   *            name: id
   *            type: number
   *            description: ID statut DAO
   *            required: true
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Dao'
   */
  router.route('/api/dao/statutdao/:id').get(daoController.allDaoByStatutDao)

  /**
   * @swagger
   * /api/dao/update:
   *  put:
   *      description: Modifier un DAO
   *      summary: Modifier un DAO
   *      tags: [DAO]
   *      parameters:
   *          - in: body
   *            name: Dao
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Dao'
   *      responses:
   *          200: 
   *              description: Success
   *              type: object
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Dao'
   */
  router.route('/api/dao/update').put(daoController.update)

  /**
   * @swagger
   * /api/dao/delete/{id}:
   *  delete:
   *      description: Supprimer un DAO
   *      summary: Supprimer un DAO
   *      tags: [DAO]
   *      parameters:
   *          - in: path
   *            name: id
   *            description: Id du DAO à supprimer
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/dao/delete/:id').delete(daoController.delete)
  //***  FIN ROUTES API POUR LA GESTION DES DAO */

  /**
   * @swagger
   * tags:
   *  name: Meta-données
   *  description: API pour la gestion des meta-données de l'application
   */

  /**
   * @swagger
   * /api/statutDao/all:
   *  get:
   *      summary: Retourne la liste des status Dao
   *      description: Retourne la liste des status Dao
   *      tags: [Meta-données]
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/StatutDao'
   */
  router.route('/api/statutDao/all').get(metaDataController.allStatutDao)

  //** ROUTES API POUR LA GESTION DES MARCHE */

  /**
   * @swagger
   * tags: 
   *  name: MARCHE
   *  description: API pour la gestion des marchés
   */

  /**
       * @swagger
       * /api/marche/allMarcheWinWithoutFactureMarche:
       *  get:
       *      description: Retourne la liste des marchés en attente de facturation
       *      summary: Retourne la liste des marchés en attente de facturation
       *      tags: [MARCHE]
       *      responses:
       *          200:
       *              description: Success
       *              type: array
       *              schema:
       *                 type: object
       *                 $ref: '#/definitions/Marche'
       */
  router.route('/api/marche/allMarcheWinWithoutFactureMarche').get(marcheController.allMarcheWinWithoutFacture)
  router.route('/api/marche/allMarcheEnCours').get(marcheController.allMarcheEnCours)
  /**
   * @swagger
   * /api/marche/all:
   *  get:
   *      description: Retourne la liste des marchés
   *      summary: Retourne la liste des marchés
   *      tags: [MARCHE]
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                 type: object
   *                 $ref: '#/definitions/Marche'
   */
  router.route('/api/marche/all').get(marcheController.all)

  /**
   * @swagger
   * /api/marche/add:
   *  post:
   *      description: Enregistrer une nouveau marché
   *      summary: Enregistrer un nouveau marché
   *      tags: [MARCHE]
   *      parameters:
   *          - in : body
   *            name: Marche
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Marche'
   *      responses:  
   *          200:
   *              description: Success
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Marche'
   */
  router.route('/api/marche/add').post(marcheController.add)

  /**
   * @swagger
   * /api/marche/statutmarche/{id}:
   *  get:
   *      description: Retourne la liste des marché par StatutMarché
   *      summary: Retourne la liste des marchés par StatutMarché
   *      tags: [MARCHE]
   *      parameters:
   *          - in: path
   *            name: id
   *            type: number
   *            description: ID statut Marche
   *            required: true
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Marche'
   */
  router.route('/api/dao/statutmarche/:id').get(marcheController.allMarcheByStatutMarche)

  /**
   * @swagger
   * /api/marche/update:
   *  put:
   *      description: Modifier un MARCHE
   *      summary: Modifier un marché
   *      tags: [MARCHE]
   *      parameters:
   *          - in: body
   *            name: Marche
   *            required: true
   *            schema:
   *              type: object
   *              $ref: '#/definitions/Marche'
   *      responses:
   *          200: 
   *              description: Success
   *              type: object
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/Marche'
   */
  router.route('/api/marche/update').put(marcheController.update)

  /**
   * @swagger
   * /api/marche/delete/{id}:
   *  delete:
   *      description: Supprimer un marché
   *      summary: Supprimer un marché
   *      tags: [MARCHE]
   *      parameters:
   *          - in: path
   *            name: id
   *            description: Id du marché à supprimer
   *            required: true
   *            type: number
   *      responses:
   *          200:
   *              description: Success
   *              type: object
   */
  router.route('/api/marche/delete/:id').delete(marcheController.delete)
  //***  FIN ROUTES API POUR LA GESTION DES MARCHE */

  /**
   * @swagger
   * tags:
   *  name: Meta-données
   *  description: API pour la gestion des meta-données de l'application
   */

  /**
   * @swagger
   * /api/statutDao/all:
   *  get:
   *      summary: Retourne la liste des status Dao
   *      description: Retourne la liste des status Dao
   *      tags: [Meta-données]
   *      responses:
   *          200:
   *              description: Success
   *              type: array
   *              schema:
   *                  type: object
   *                  $ref: '#/definitions/StatutDao'
   */
  router.route('/api/statutDao/all').get(metaDataController.allStatutDao)
  //*** FIN ROUTES POUR LES API GESTION DES FAMILLES DARTICLES */

  /**
  * @swagger
  * /api/statutMarche/all:
  *  get:
  *      summary: Retourne la liste des marches
  *      description: Retourne la liste des marchés
  *      tags: [Meta-données]
  *      responses:
  *          200:
  *              description: Success
  *              type: array
  *              schema:
  *                  type: object
  *                  $ref: '#/definitions/StatutMarche'
  */
  router.route('/api/statutMarche/all').get(metaDataController.allStatutMarche)

  /**
 * @swagger
 * /api/typeFinancement/all:
 *  get:
 *      summary: Retourne la liste des types de financement
 *      description: Retourne la liste des types de financement
 *      tags: [Meta-données]
 *      responses:
 *          200:
 *              description: Success
 *              type: array
 *              schema:
 *                  type: object
 *                  $ref: '#/definitions/TypeFinancement'
 */
  router.route('/api/typeFinancement/all').get(metaDataController.allTypeFinancement)

  /**
 * @swagger
 * /api/typeDocument/all:
 *  get:
 *      summary: Retourne la liste des types de documents
 *      description: Retourne la liste des types de documents
 *      tags: [Meta-données]
 *      responses:
 *          200:
 *              description: Success
 *              type: array
 *              schema:
 *                  type: object
 *                  $ref: '#/definitions/TypeDocument'
 */
  router.route('/api/typeDocument/all').get(metaDataController.allTypeDocument)

  /**
* @swagger
* /api/typeCaution/all:
*  get:
*      summary: Retourne la liste des types de caution pour un marche
*      description: Retourne la liste des types de caution pour un marche
*      tags: [Meta-données]
*      responses:
*          200:
*              description: Success
*              type: array
*              schema:
*                  type: object
*                  $ref: '#/definitions/TypeCaution'
*/
  router.route('/api/typeCaution/all').get(metaDataController.allTypeCaution)


  /**
  * @swagger
  * /api/typeTiers/all:
  *  get:
  *      summary: Retourne la liste des types de Tiers
  *      description: Retourne la liste des types de Tiers
  *      tags: [Meta-données]
  *      responses:
  *          200:
  *              description: Success
  *              type: array
  *              schema:
  *                  type: object
  *                  $ref: '#/definitions/TypeTiers'
  */
  router.route('/api/typeTiers/all').get(metaDataController.allTypeTiers)


  /**
  * @swagger
  * /api/modereglement/all:
  *  get:
  *      summary: Retourne la liste des modes de reglement
  *      description: Retourne la liste des modes de reglements
  *      tags: [Meta-données]
  *      responses:
  *          200:
  *              description: Success
  *              type: array
  *              schema:
  *                  type: object
  *                  $ref: '#/definitions/ModeReglement'
  */
  router.route('/api/modereglement/all').get(metaDataController.allModeReglement)

  /**
 * @swagger
 * /api/typearticle/all:
 *  get:
 *      summary: Retourne la liste des types articles
 *      description: Retourne la liste des types articles
 *      tags: [Meta-données]
 *      responses:
 *          200:
 *              description: Success
 *              type: array
 *              schema:
 *                  type: object
 *                  $ref: '#/definitions/TypeArticle'
 */
  router.route('/api/typearticle/all').get(metaDataController.allTypeArticle)

  //*** FIN ROUTES POUR LES API GESTIONS DES META DONNEES */


  //*** DOCUMENATIONS DES MODELES OU COMPOSANTS DE LAPI */
  /**
   * @swagger
   * definitions:
   *  Famille:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - intitule
   *      properties:
   *          id:
   *              type: number
   *              description: Cle unique genere de facon automatique
   *          code:
   *              type: string
   *              description: Designe le code de la famille d'article
   *          intitule:
   *              type: string
   *              description: Designe l'intitule de la famille d'article
   *  CategorieTarifaire:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - intitule
   *      properties:
   *          id:
   *              type: number
   *              description: Cle unique genere de facon automatique
   *          code:
   *              type: string
   *              description: Designe le code de la categorie tarifaire
   *          intitule:
   *              type: string
   *              description: Designe l'intitule de la categorie tarifaire
   *  CategorieArticle:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - intitule
   *      properties:
   *          id:
   *              type: number
   *              description: Cle unique genere de facon automatique
   *          code:
   *              type: string
   *              description: Designe le code de la categorie d'article
   *          intitule:
   *              type: string
   *              description: Designe l'intitule de la categorie d'article
   *  StatutDao:
   *      type: object
   *      required:
   *          - id
   *          - statut
   *      properties:
   *          id:
   *              type: number
   *              description: Clé unique pour identifier SatutDao
   *          statut:
   *              type: string
   *              description: Désigne Statut StatutDao
   *  Dao:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - designation
   *          - dateDepot
   *          - dateAnnonce
   *      properties:
   *          id:
   *              type: number
   *              description: Cle unique generer automatiquement
   *          code:
   *              type: string
   *              description: code du Dao
   *          designation:
   *              type: string
   *              description: Désignation du DAO
   *          soumissionnaire:
   *              type: string
   *              description: Soumissionnaire du DAO
   *          dateDepot:
   *              type: string
   *              description: Date du dépot du DAO
   *              format: date-time
   *          montantOffre:
   *              type: number
   *              description: Montant du DAO
   *          montantAccepte:
   *              type: number
   *              description: Montant Accepter du DAO
   *          dateAnnonce:
   *              type: string
   *              description: Date de l'annonce du DAO
   *              format: date-time
   *          motif:
   *              type: string
   *              description: Motif
   *          statutDao:
   *              type: object
   *              $ref: '#/definitions/StatutDao'
   *  Marche:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - designation
   *          - maitreOuvrage
   *          - financement
   *      properties:
   *          id:
   *              type: number
   *              description: Id generer de facon automatique pour un marche
   *          code:
   *              type: string
   *              description: code du marché
   *          designation:
   *              type: string
   *              description: Désignatuon du marché
   *          maitreOuvrage:
   *              type: string
   *              description: Maitre d'ouvrage
   *          travaux:
   *              type: string
   *              description: Travaux
   *          typeFinancement:
   *              type: object
   *              description: Type de financement
   *              $ref: '#/definitions/TypeFinancement'
   *          bailleur1:
   *              type: string
   *              description: Bailleur N°1
   *          tauxBailleur1:
   *              type: number
   *              description: Taux Bailleur N°1
   *          montantBailleur1:
   *              type: number
   *              description: Montant Bailleur N°1
   *          bailleur2:
   *              type: string
   *              description: Bailleur N°2
   *          tauxBailleur2:
   *              type: number
   *              description: Taux Bailleur N°2
   *          montantBailleur2:
   *              type: number
   *              description: Montant Bailleur N°2
   *          bailleur3:
   *              type: string
   *              description: Bailleur N°3
   *          tauxBailleur3:
   *              type: number
   *              description: Taux Bailleur N°3
   *          montantBailleur3:
   *              type: number
   *              description: Montant Bailleur N°3    
   *          montantGlobal:
   *              type: number
   *              description: Montant Global
   *          montantFacture:
   *              type: number
   *              description: Montant Facturé
   *          montantPayer:
   *              type: number
   *              description: MontantPaye
   *          resteAPayer:
   *              type: number
   *              description: Reste à payer
   *          tauxRealisation:
   *              type: number
   *              description: Taux de réalisation
   *          statutMarche:
   *              type: object
   *              description: Statut Marché
   *              $ref: '#/definitions/StatutMarche'
   *          dao:
   *              type: object
   *              description: DAO
   *              $ref: '#/definitions/Dao'
   *  StatutMarche:
   *      type: object
   *      required:
   *          - id
   *          - statut
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          statut:
   *              type: string
   *              description: Statut du marche
   *  TypeFinancement:
   *      type: object
   *      required:
   *          - id
   *          - type
   *      properties:
   *          id: 
   *              type: number
   *              description: ID generer de facon automatique
   *          type: 
   *              type: string
   *              description: Type de financement
   *  TypeTiers:
   *      type: object
   *      required:
   *          - id
   *          - type
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          type:
   *              type: string
   *              description: Type Tiers
   *  TypeCaution:
   *      type: object
   *      required:
   *          - id
   *          - type
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          type:
   *              type: string
   *              description: Type Caution
   *  TypeDocument:
   *      type: object
   *      required: 
   *          - id
   *          - intitule
   *          - doType
   *          - domain
   *      properties:
   *          id:
   *             type: number
   *             description: ID generer de facon automatique 
   *          intitule:
   *             type: string
   *             description: Intitule du type Document
   *          doType:
   *             type: number
   *             description: doType du document
   *          domain:
   *             type: number
   *             description: domain du document
   *  Panne:
   *      type: object
   *      required:
   *          - id
   *          - intitule
   *          - categorie
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          intitule:
   *              type: string
   *              description: Intitule da la panne
   *          categorie:
   *              type: string
   *              description: Categorie de la panne 
   *          autresInfos:
   *              type: string
   *              description: Autres informations liee a la panne
   *  DeclarationPanne:
   *      type: object
   *      required:
   *          - id
   *          - datePanne
   *          - heurePanne
   *          - lieuPanne
   *          - kilometreParcouru
   *          - dateDiagnostic
   *          - heureDiagnostic
   *          - descriptionPanne
   *          - descriptionDiagnostic
   *          - panne
   *          - article
   *      properties:
   *          id:
   *              type: number
   *              description: ID declaration panne
   *          datePanne:
   *              type: string
   *              description: Date panne
   *              format: date-time
   *          heurePanne:
   *              type: string
   *              description: heure de la panne
   *          lieuPanne:
   *              type: string
   *              description: Lieu panne
   *          descriptionPanne:
   *              type: string
   *              description: Description panne
   *          originePanne:
   *              type: string
   *              description: Origine de la panne
   *          technicien:
   *              type: string
   *              description: Tehnicien ayant diagnostique la panne
   *          dateDiagnostic:
   *              type: string
   *              description: Date diagnostic panne
   *          heureDiagnostic:
   *              type: string
   *              description: Heure diagnostic
   *          descriptionDiagnostic: 
   *              type: string
   *              description: Description diagnostic
   *          numeroDevis:
   *              type: string
   *              description: Numero du Devis
   *          kilometreParcouru:
   *              type: number
   *              description: Kilometre parcouru
   *          panne:
   *              type: object
   *              description: panne
   *              $ref: '#/definitions/Panne'
   *          article:
   *              type: object
   *              description: vehicule en panne
   *  Tiers:
   *      type: object
   *      required:
   *          - id
   *          - numero
   *          - intitule
   *          - adresse
   *          - ville
   *          - region
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          numero:
   *              type: string
   *              description: Numero du tiers
   *          intitule: 
   *              type: string
   *              description: Intitule du tiers
   *          adresse:
   *              type: string
   *              description: Adresse du tiers
   *          region:
   *              type: string
   *              description: Region du tiers
   *          ville:
   *              type: string
   *              description: Ville du tiers
   *          ifu:
   *              type: string
   *              description: ifu du tiers
   *          telephone1: 
   *              type: string
   *              description: Telephone du tiers
   *          telephone2: 
   *              type: string
   *              description: Telephone 2 du tiers
   *          email:
   *              type: string
   *              description: Email du tiers
   *          site:
   *              type: string
   *              description: Site du tiers
   *          autresInfos: 
   *              type: string
   *              description: autres informations le tiers
   *          typeTiers:
   *              type: object
   *              $ref: '#/definitions/TypeTiers'
   *  ModeReglement:
   *      type: object
   *      required:
   *          - id
   *          - intitule
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          intitule: 
   *              type: string
   *              description: Mode de reglement
   *  TypeArticle:
   *      type: object
   *      required:
   *          - id
   *          - type
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique 
   *          type:
   *              type: string
   *              description: Intitule du type Article
   *  Entrepot:
   *      type: object
   *      required:
   *          - id
   *          - intitule
   *          - statut
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          intitule: 
   *              type: string
   *              description: Intitule Entrepot
   *          responsable:
   *              type: string
   *              description: responsable
   *          statut:
   *              type: string
   *              enum:
   *                  - FERMER
   *                  - CLOTURER
   *                  - OUVERT
   *                  - NEANT
   *          tiers:
   *              type: object
   *              $ref: '#/definitions/Tiers'
   *  ReglementFactureMarche:
   *      type: object
   *      required:
   *          - id
   *          - reference
   *          - dateReg
   *          - montantReg
   *          - factureMarche
   *          - modeReglement
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          reference: 
   *              type: string
   *              description: Reference Reglement
   *          dateReg:
   *              type: string
   *              description: Date Reglement
   *              format: date-time
   *          autresInfo: 
   *              type: string
   *              description: Autres informations
   *          montantReg:
   *              type: number
   *              description: Montant Reglement
   *          modeReglement:
   *              type: object
   *              $ref: '#/definitions/ModeReglement'
   *          factureMarche:
   *              type: object
   *              $ref: '#/definitions/FactureMarche'
   *  FactureMarche:
   *      type: object
   *      required:
   *          - id
   *          - marche
   *      properties:
   *          id: 
   *              type: number
   *              description: D generer de facon automatique
   *          dateCreated:
   *              type: string
   *              description: date de creation facture
   *              format: date-time
   *          dateUpdated:
   *              type: string
   *              description: date de creation facture
   *              format: date-time
   *          reference:
   *              type: string
   *              description: reference de la facture
   *          montantFacture:
   *              type: number
   *              description: Montant de la facture
   *          montantPaye:
   *              type: number
   *              description: Montant Payer
   *          uid:
   *              type: string
   *              description: uid facture normaliser
   *          qrcode:
   *              type: string
   *              description: qrcode facture normaliser
   *          codeMECeFDGI:
   *              type: string
   *              description: codeMECeFDGI facture normaliser
   *          dateTimeMECeF:
   *              type: string
   *              description: dateTimeMECeF facture normaliser
   *              format: date-time
   *          countersMECeF:
   *              type: string
   *              description: countersMECeF facture normaliser
   *          NIMMECEF:
   *              type: string
   *              description: NIMMECEF facture normaliser
   *          AIB:
   *              type: number
   *              description: AIB facture normaliser
   *          Taux_AIB:
   *              type: number
   *              description: Taux_AIB facture normaliser
   *          BaseAIB:
   *              type: number
   *              description: BaseAIB facture normaliser
   *          tax_TVA:
   *              type: number
   *              description: Taxe TVA facture
   *          remise:
   *              type: number
   *              description: Remise facture
   *          montantNetHt:
   *              type: number
   *              description: Montant Net Hors taxe facture
   *          montantNetTTC:
   *              type: number
   *              description: Montant TTC taxe facture
   *          netAPayer:
   *              type: number
   *              description: Net A Payer taxe facture
   *          statut:
   *              type: string
   *              enum:
   *                  - ENTIEREMENT PAYEE
   *                  - PARTIELLEMENT PAYEE
   *                  - NON PAYEE
   *              description: statut de facture
   *          marche:
   *              type: object
   *              $ref: '#/definitions/Marche'
   *  OperationChantier:
   *      type: object
   *      required:
   *          - id
   *          - date
   *          - heure
   *          - type
   *      properties:
   *          id: 
   *              type: number
   *              description: D generer de facon automatique
   *          date:
   *              type: string
   *              description: date operation
   *              format: date-time
   *          heure:
   *              type: string
   *              description: Heure Operation
   *          observation:
   *              type: string
   *              description: Observation operation
   *          type:
   *              type: string
   *              enum:
   *                  - FERMER
   *                  - CLOTURER
   *                  - OUVERT
   *                  - NEANT
   *              description: Type operation
   *          entrepot:
   *              type: object
   *              $ref: '#/definitions/Entrepot'
   *  Taxe:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - intitule
   *          - taux
   *          - valeur
   *          - sens
   *      properties:
   *          id:
   *              type: number
   *              description: ID generer de facon automatique
   *          intitule:
   *              type: string
   *              description: Intitule taxe
   *          code: 
   *              type: string
   *              description: code taxxe
   *          taux:
   *              type: number
   *              description: taux en pourcentage de la taxe
   *          valeur: 
   *              type: number
   *              description: Valeur de la taxe
   *          sens: 
   *              type: string
   *              enum:
   *                  - DEDUCTIBLE
   *                  - RECUPERABLE      
   *  User:
   *      type: object
   *      required:
   *          - id
   *          - email
   *          - userName
   *          - nom
   *          - prenoms
   *          - password
   *          - role
   *      properties:
   *          id:
   *              type: number
   *              description: Id generer de facon automatique
   *          email: 
   *              type: string
   *              description: Email user
   *          userName:
   *              type: string
   *              description: Nom d'utilisateur
   *          nom:
   *              type: string
   *              description: Nom de l'utilisateur
   *          prenoms:
   *              type: string
   *              description: Prenoms de l'utilisateur
   *          password:
   *              type: string
   *              description: Mot de passe user
   *          role:
   *              type: string
   *              enum:
   *                  - ADMIN
   *                  - UTILISATEUR
   *                  - NONE
   *              description: Role de l'utilisateur
   *          telephone1: 
   *              type: string
   *              description: Telephone user
   *          telephone2: 
   *              type: string
   *              description: Telephone 2 user
   *          pays:
   *              type: string
   *              description: Pays de lutilisateur
   *          ville:
   *              type: string
   *              description: Ville user
   *          adresse: 
   *              type: string
   *              description: Adresse user
   *          autresInfos:
   *              type: string
   *              description: Autres Informations User
   *          isAdmin:
   *              type: boolean
   *              description: Est Admin?  
   *  Article:
   *      type: object
   *      required:
   *          - id
   *          - reference
   *          - designation
   *          - statut
   *          - famille
   *          - categorieArticle
   *          - typeArticle
   *          - matiere
   *      properties:
   *          id: 
   *              type: number
   *              description: ID generer de facon automatique
   *          reference:
   *              type: string
   *              description: Reference article
   *          designation:
   *              type: string
   *              description: Designation article
   *          aliasArticle:
   *              type: string
   *              description: alias de larticle
   *          codeBarre:
   *              type: string
   *              description: code barre de larticle EAN13
   *          prixAchTTC:
   *              type: number
   *              description: prix achat ttc
   *          prixVteTTC:
   *              description: prix de vente TTC
   *              type: number
   *          estUnique:
   *              description: Gere de facon unique l'article
   *              type: boolean
   *          estLouer:
   *              type: boolean
   *              description: Est loue?
   *          agregat:
   *              type: boolean
   *              description: Agregat
   *          estImmobilise:
   *              type: boolean
   *              description: Article immobilisé ou pas
   *          enPanne:
   *              type: boolean
   *              description: Article en panne
   *          matiere:
   *              type: string
   *              description: Matiere
   *              enum:
   *                  - FINI
   *                  - SEMI_FINI
   *                  - PREMIERE
   *          statut:
   *              type: string
   *              description: Statut
   *              enum:
   *                  - ACTIF
   *                  - EN_SOMMEIL
   *          famille:
   *              type: object
   *              $ref: '#/definitions/Famille'
   *          typeArticle:
   *              type: object
   *              $ref: '#/definitions/TypeArticle'
   *          categorieArticle:
   *              type: object
   *              $ref: '#/definitions/CategorieArticle'    
   *  Chantier:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - designation
   *          - statut
   *          - dateContratOuv
   *          - dateContratClot
   *          - responsable
   *      properties:
   *          id: 
   *              type: number
   *              description: ID generer de facon automatique
   *          code:
   *              type: string
   *              description: code du chantier
   *          designation:
   *              type: string
   *              description: Designation chantier
   *          dateContratOuv:
   *              type: string
   *              description: date debut du contrat
   *              format: date-time
   *          dateContratClot:
   *              type: string
   *              description: date cloture du contrat
   *              format: date-time
   *          dateOuvReel:
   *              type: string
   *              description: Date debut reelle du chantier
   *              format: date-time
   *          dateClotReel:
   *              type: string
   *              description: Date cloture reelle du chantier
   *              format: date-time
   *          dateRecepProv:
   *              type: string
   *              description: Date reception provisoire du chantier
   *              format: date-time
   *          dateRecepDef:
   *              type: string
   *              description: Date reception definitive du chantier
   *              format: date-time
   *          responsable:
   *              type: string
   *              description: Responsable du chantier
   *          autresInfo:
   *              type: string
   *              description: Autres informations sur le chantier
   *          statut:
   *              type: string
   *              description: Statut
   *              enum:
   *                  - EN COURS
   *                  - ARRET PROVISOIRE
   *                  - ARRET DEFINITIF
   *                  - RECEPTION PROVISOIRE
   *                  - RECEPTION DEFINITIVE
   *          marche:
   *              type: object
   *              $ref: '#/definitions/Marche'
   * 
   *  ContratSousTraitant:
   *      type: object
   *      required:
   *          - id
   *          - code
   *          - designation
   *          - travaux
   *          - statut
   *          - dateDebContrat
   *      properties:
   *          id: 
   *              type: number
   *              description: ID generer de facon automatique
   *          code:
   *              type: string
   *              description: code du contrat
   *          designation:
   *              type: string
   *              description: Designation contrat
   *          dateDebContrat:
   *              type: string
   *              description: date debut du contrat
   *              format: date-time
   *          dateFinContrat:
   *              type: string
   *              description: date Fin du contrat
   *              format: date-time
   *          montantInitial:
   *              type: number
   *              description: montantInitial du contrat
   *          montantAvenant:
   *              type: number
   *              description: montant Avenant du contrat
   *          montantFacture:
   *              type: number
   *              description: montantFacture du contrat
   *          montantPayer:
   *              type: number
   *              description: montantPayer du contrat
   *          resteAPayer:
   *              type: number
   *              description: resteAPayer du contrat
   *          travaux:
   *              type: string
   *              description: travaux
   *          statut:
   *              type: string
   *              description: Statut
   *              enum:
   *                  - EN COURS
   *                  - TERMINER
   *          chantier:
   *              type: object
   *              $ref: '#/definitions/Chantier'
   *          tiers:
   *              type: object
   *              $ref: '#/definitions/Tiers'
   */

  //*** FIN DOCUMENTTION DES MODELES OU COMPOSANTS DE LAPI */
  return router;
})();
