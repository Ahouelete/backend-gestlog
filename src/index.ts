import { AppDataSource } from "./data-source"
import express from "express"
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
    app.use(bodyParer.json({ limit: "50mb" }));
    app.use(bodyParer.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
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
                // url: ['https://boiling-forest-65930.herokuapp.com']
                //url: ['http://localhost/']
                url: ['https://backend-gestlog.herokuapp.com']
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
    //app.listen(9000)
    app.listen(process.env.PORT || 3000)
}).catch(error => console.log(error))
