import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "./entity/article"
import { AvanceMarche } from "./entity/avance_marche"
import { CategorieArticle } from "./entity/categorieArticle"
import { CategorieTarifaire } from "./entity/categorieTarifaire"
import { Chantier } from "./entity/chantier"
import { ContratSousTraitant } from "./entity/contrat_sous_traitant"
import { Dao } from "./entity/dao"
import { DaoMotifRejet } from "./entity/daoMotifRejet"
import { DaoSoumissionnaire } from "./entity/daoSoumissionaire"
import { DeclarationPanne } from "./entity/declarationPanne"
import { Entrepot } from "./entity/entrepot"
import { FactureMarche } from "./entity/factureMarche"
import { Famille } from "./entity/famille"
import { ImputationAvanceMarche } from "./entity/imputation_avance_marche"
import { Marche } from "./entity/marche"
import { ModeReglement } from "./entity/modeReglement"
import { MotifRejet } from "./entity/motifDao"
import { OperationChantier } from "./entity/operationChantier"
import { Panne } from "./entity/panne"
import { PieceJointeDao } from "./entity/pieceJointeDao"
import { PieceDao } from "./entity/piece_dao"
import { P_MECEF } from "./entity/p_mecef"
import { P_SOCIETE } from "./entity/p_societe"
import { ReglementFactureMarche } from "./entity/reglementFactureMarche"
import { Soumissionnaire } from "./entity/soumissionnaire"
import { StatutDao } from "./entity/statutDao"
import { StatutMarche } from "./entity/statutMarche"
import { Taxe } from "./entity/taxe"
import { Tiers } from "./entity/tiers"
import { TypeArticle } from "./entity/typeArticle"
import { TypeCaution } from "./entity/typeCaution"
import { TypeDocument } from "./entity/typeDocument"
import { TypeFinancement } from "./entity/typeFinancement"
import { TypeTiers } from "./entity/typeTiers"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({

   /*  host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12344321",
    database: "gestlog",
    type: "postgres",
    entities: [User, Famille, Article, StatutDao, Dao, StatutMarche, TypeFinancement, Marche, TypeDocument, TypeTiers,
        TypeCaution, CategorieArticle, CategorieTarifaire, Panne, DeclarationPanne, Tiers, TypeArticle, ModeReglement,
        Entrepot, OperationChantier, Taxe, FactureMarche, ReglementFactureMarche, P_MECEF, P_SOCIETE,
        Chantier, ContratSousTraitant, PieceDao, PieceJointeDao, ImputationAvanceMarche, AvanceMarche,DaoSoumissionnaire, 
        Soumissionnaire, MotifRejet, DaoMotifRejet],
    migrations: [],
    subscribers: [],
    synchronize: true,
    logging: false, */
    //****************** CONNEXION POUR HEROKU ************************************/
     type: "postgres",
     synchronize: true,
     logging: false,
     name: "default",
     url: "postgres://ilhahdjvobiymw:249c2299d536e529e7374cc8df4060ef313e107563d5d35e9222e5d2a9b8b645@ec2-54-228-218-84.eu-west-1.compute.amazonaws.com:5432/d6gerrmiot1fqg",
     entities: [User, Famille, Article, StatutDao, Dao, StatutMarche, TypeFinancement, Marche, TypeDocument, TypeTiers,
        TypeCaution, CategorieArticle, CategorieTarifaire, Panne, DeclarationPanne, Tiers, TypeArticle, ModeReglement,
        Entrepot, OperationChantier, Taxe, FactureMarche, ReglementFactureMarche, P_MECEF, P_SOCIETE,
        Chantier, ContratSousTraitant, PieceDao, PieceJointeDao, ImputationAvanceMarche, AvanceMarche,DaoSoumissionnaire, 
        Soumissionnaire, MotifRejet, DaoMotifRejet],
     migrations: [],
     subscribers: [],
     ssl: true,
     extra: {
         ssl: {
             "rejectUnauthorized": false
         }
     }
    // *********************** FIN CONNEXION HEROKU ******************************
})
