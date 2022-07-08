import { AppDataSource } from "./data-source"
import express, { application } from "express"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import bodyParer from "body-parser"
import { MetaData } from "./controller/metadataController"
const routes = require("./routes").apiRouter
const cors = require("cors")
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
// Initialisation de connnexion a la base de donnees postgres
AppDataSource.initialize().then(async () => {

    const app = express()
    app.use(bodyParer.json())
    app.use(cors(corsOptions))
    // Definition des configurations pour la Documentations du web sevice
    const swaggerOptions = {
        definition: {
            info: {
                title: 'SERVICE WEB POUR LA GESTION LOGISTIQUE',
                description: 'Tous les services pour les applications tierces pour la consommation des webservices.',
                version: '1.0',
                contact: {
                    name: 'GESTLOG DEVELOPPEMENT SUPPORT',
                    url: 'www.gestlog-support.com',
                    email: 'gestlog-support@gmail.com'
                }
            },
            servers: {
                url: ['http://localhost:25000', 'https://localhost:25000']
            },
            securityDefinitions: {
                Authentification: {
                    type: 'apiKey',
                    name: 'authorization',
                    description: 'User Authentification Token',
                    in: 'header'
                }
            },
            security: [{
                Authentification: []
            }]
        },
        apis: ['./src/routes.ts']
    }

    const swaggerDoc = swaggerJsDoc(swaggerOptions)
    app.use("/swagger-ui.html", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    app.use("/", routes)

    const metaDatas = new MetaData()
    metaDatas.add(null, null, null)

    
    //*** FIN INSERTION DES DONNEES PARAMETRABLES */

    //PORT DECOUTE DU SERVEUR
    app.listen(25000)

}).catch(error => console.log(error))
