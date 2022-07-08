import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "./entity/article"
import { CategorieArticle } from "./entity/categorieArticle"
import { CategorieTarifaire } from "./entity/categorieTarifaire"
import { Chantier } from "./entity/chantier"
import { ContratSousTraitant } from "./entity/contrat_sous_traitant"
import { Dao } from "./entity/dao"
import { DeclarationPanne } from "./entity/declarationPanne"
import { Entrepot } from "./entity/entrepot"
import { FactureMarche } from "./entity/factureMarche"
import { Famille } from "./entity/famille"
import { Marche } from "./entity/marche"
import { ModeReglement } from "./entity/modeReglement"
import { OperationChantier } from "./entity/operationChantier"
import { Panne } from "./entity/panne"
import { P_MECEF } from "./entity/p_mecef"
import { P_SOCIETE } from "./entity/p_societe"
import { ReglementFactureMarche } from "./entity/reglementFactureMarche"
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
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12344321",
    database: "gestlog",
    synchronize: true,
    logging: false,
    entities: [User, Famille, Article, StatutDao, Dao,StatutMarche,TypeFinancement,Marche, TypeDocument,TypeTiers,
        TypeCaution, CategorieArticle, CategorieTarifaire, Panne, DeclarationPanne, Tiers, TypeArticle, ModeReglement,
        Entrepot, OperationChantier, Taxe, FactureMarche, ReglementFactureMarche, P_MECEF, P_SOCIETE, Chantier, ContratSousTraitant],
    migrations: [],
    subscribers: [],
})
