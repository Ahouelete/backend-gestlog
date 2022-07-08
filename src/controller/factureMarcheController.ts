//imports
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { FactureMarche } from "../entity/factureMarche";
import { Marche } from "../entity/marche";
import { P_MECEF } from "../entity/p_mecef";
import fetch from 'node-fetch';
import { verifyToken } from '../jwt.utils'
import { P_SOCIETE } from "../entity/p_societe";
var QRCode = require('qrcode')
const PDFDocument = require('pdfkit');
var fs = require('fs');
const blobStream = require('blob-stream');
const { Base64Encode } = require('base64-stream');

//Constantes
const marcheRepository = AppDataSource.getRepository(Marche)
const factureMarcheRepository = AppDataSource.getRepository(FactureMarche)
const pMecefRepository = AppDataSource.getRepository(P_MECEF)
const pSocieteRepository = AppDataSource.getRepository(P_SOCIETE)
//Controller
export class FactureMarcheController {
    //

    async generateFacture(req, res, next) {
        try {
            const marcheAdd = req.body
            const marchefound = await marcheRepository.findOne({
                relations: {
                    statutMarche: true
                },
                where: {
                    id: marcheAdd.id,
                    code: marcheAdd.code,
                    designation: marcheAdd.designation
                }
            })

            if (!marchefound) return res.send({ description: 'error', message: "L'objet Marché n'est n\'existe pas" })

            if (marchefound.statutMarche.statut != 'RECEPTION DEFINITIVE')
                return res.send({ description: 'error', message: "L'objet Marché n'est n\'a pas le statut 'RECEPTION DEFINITIVE' " })

            const remise = +marcheAdd.remise
            const montantNetHt = marchefound.montantGlobal - remise
            const Taux_AIB = +marcheAdd.taux_AIB
            const BaseAIB = montantNetHt
            const AIB = Math.round(BaseAIB * Taux_AIB / 100)
            const tax_TVA = +marcheAdd.tax_TVA
            const montantNetTTC = montantNetHt + Math.round((tax_TVA * montantNetHt / 100))
            const netAPayer = montantNetTTC + AIB

            const nbInvoice = await factureMarcheRepository.find({
            })
            const len = nbInvoice.length + 1
            const suffix = len + ''
            let suffixConcat = ''
            for (let i = 0; i <= 7 - suffix.length; i++) {
                suffixConcat = suffixConcat + '0'
            }
            const ref = '2022-FA-' + suffixConcat + suffix
            const facture = {
                marche: marchefound,
                statut: 'NON PAYEE',
                reference: ref,
                montantPaye: 0,
                montantFacture: netAPayer,
                netAPayer,
                montantNetHt,
                montantNetTTC,
                tax_TVA,
                AIB,
                BaseAIB,
                Taux_AIB,
                remise
            }
            const result = await factureMarcheRepository.create(facture)
            const reslts = await factureMarcheRepository.save(result)

            marchefound.montantFacture = netAPayer
            await marcheRepository.update({ id: marchefound.id }, marchefound)

            return res.send({ description: 'success', data: reslts })
        }

        catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async normaliserFacture(req, res, next) {
        try {

            const facture = req.body
            const factureFound = await factureMarcheRepository.createQueryBuilder("factureMarche")
                .leftJoinAndSelect("factureMarche.marche", "marche")
                .leftJoinAndSelect("marche.dao", "dao")
                .leftJoinAndSelect("dao.tiers", "tiers")
                .leftJoinAndSelect("dao.statutDao", "statutDao")
                .where("factureMarche.id = :id", { id: facture.id })
                .andWhere("factureMarche.reference = :reference", { reference: facture.reference })
                .getOne()

            if (factureFound == null || factureFound == undefined) {
                return res.send({ description: 'error', message: 'Cette facture n\'existe pas' })
            }

            if (factureFound.codeMECeFDGI != null && factureFound.codeMECeFDGI != undefined)
                return res.send({ description: 'error', message: 'Cette facture a été déjà normalisée' })

            // NORMALISATION DE LA FACTURE DE VENTE

            /****
             * OBTENIR LES INFORMATIONS DE LAPI MECEF
             */
            const infoApiMecef = await pMecefRepository.find()
            if (infoApiMecef.length == 0)
                return res.send({ description: 'error', message: 'Les informations de base de l\'api e-MECeF n\'existe pas' })
            const infoMecef = infoApiMecef[0]

            /**
             * ENVOIE DE REQUETE AU SERVEUR DE LA DGI
             */
            const response = await fetch(infoMecef.urlApiMECEF + "/info/status", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + infoMecef.jwtToken }
            })

            const infoEntreprise = await response.json()

            if (infoEntreprise.emcfList.length == 0) {
                return res.send({ description: 'error', message: "VOUS NE DISPOSEZ D'AUCUNE MACHINE E-MECEF! VEUILLEZ CONTACTER VOTRE ADMINISTRATEUR" })
            }
            if (infoEntreprise.emcfList[0].status != 'Actif') {
                return res.send({ description: 'error', message: "VOUS NE DISPOSEZ D'AUCUNE MACHINE E-MECEF ACTIVE! VEUILLEZ CONTACTER VOTRE ADMINISTRATEUR" })
            }


            const invoice: any = {}
            invoice.ifu = infoEntreprise.ifu

            if (factureFound.Taux_AIB == 1 || factureFound.Taux_AIB == 5) {
                invoice.aib = factureFound.Taux_AIB == 1 ? 'A' : 'B'
            }
            invoice.reference = factureFound.reference
            invoice.type = 'FV'

            //detail produits
            const items: any[] = [{}]
            items[0].name = factureFound.marche.travaux
            items[0].price = factureFound.montantNetTTC
            items[0].quantity = 1
            items[0].taxGroup = factureFound.tax_TVA == 18 ? 'B' : 'A'
            invoice.items = items

            //paiements
            const payments: any[] = [{}]
            payments[0].name = 'AUTRE'
            payments[0].amount = factureFound.netAPayer
            invoice.payment = payments
            //client
            const client: any = {}
            client.name = factureFound.marche.dao.tiers.numero + ' ' + factureFound.marche.dao.tiers.intitule
            client.conatct = factureFound.marche.dao.tiers.email
            client.address = factureFound.marche.dao.tiers.adresse
            invoice.client = client

            // user

            const operateur: any = {}
            const header = req.headers.authorization
            const token = header.replace('Bearer ', '')
            const userConnect = verifyToken(token)
            if (userConnect)
                operateur.name = userConnect.nom + ' ' + userConnect.prenoms
            invoice.operator = operateur

            /**
             * ENVOIE DE LA FACTURE A LA BASE DE DONNEES MECEF DGI
             */

            const dataResponse = await fetch(infoMecef.urlApiMECEF + "/invoice", {
                method: 'POST',
                body: JSON.stringify(invoice),
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + infoMecef.jwtToken }
            })
            const responseInvoice = await dataResponse.json()

            if (responseInvoice.errorDesc) {
                return res.send({ description: 'error', message: responseInvoice.errorDesc })
            }

            /**
            * CONFIRMATION DE LA FACTURE DE VENTE
            */

            if (!responseInvoice.uid) return res.send({ description: 'error', message: responseInvoice.errorDesc })

            const finalResponse = await fetch(infoMecef.urlApiMECEF + "/invoice/" + responseInvoice.uid + "/confirm", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + infoMecef.jwtToken }
            })
            const finalResponseInvoice = await finalResponse.json()

            if (finalResponseInvoice.errorDesc) return res.send({ description: 'error', message: finalResponseInvoice.errorDesc })

            // MISE A JOUR DE MA BASE DE DONNEES DES INFORMATIONS MECEF

            factureFound.NIMMECEF = finalResponseInvoice.nim
            factureFound.countersMECeF = finalResponseInvoice.counters
            factureFound.dateTimeMECeF = finalResponseInvoice.dateTime
            factureFound.qrcode = finalResponseInvoice.qrCode
            factureFound.codeMECeFDGI = finalResponseInvoice.codeMECeFDGI
            factureFound.uid = responseInvoice.uid

            // FIN NORMALISATION DE LA FACTURE
            console.log(factureFound)
            await factureMarcheRepository.update({ id: factureFound.id }, factureFound)
            const reslt = await factureMarcheRepository.find({
                where: {
                    id: factureFound.id,
                },
                relations: {
                    marche: true
                }
            })
            return res.send({ description: 'success', message: reslt })


        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async all(req, res, next) {
        try {
            const factures = await factureMarcheRepository.find({
                relations: {
                    marche: true
                }
            })

            return res.send({ description: 'success', data: factures })
        } catch (error) {
            return res.send({ description: 'error', message: error })
        }
    }

    async printInvoice(req, res, next) {
        try {

            const formatDate = new Intl.DateTimeFormat()
            const formatNumber = new Intl.NumberFormat()

            const invoice = req.body
            const invoiceFound = await factureMarcheRepository.createQueryBuilder("factureMarche")
                .leftJoinAndSelect("factureMarche.marche", "marche")
                .leftJoinAndSelect("marche.dao", "dao")
                .leftJoinAndSelect("dao.tiers", "tiers")
                .leftJoinAndSelect("dao.statutDao", "statutDao")
                .where("factureMarche.id = :id", { id: invoice.id })
                .andWhere("factureMarche.reference = :reference", { reference: invoice.reference })
                .getOne()

            if (!invoiceFound) return ({ description: 'error', message: 'Cette facture n\'existe pas' })

            const listTaxe = []
            if (invoiceFound.tax_TVA) {
                listTaxe.push({
                    tax: 'TVA(' + invoiceFound.tax_TVA + '%)',
                    base: invoiceFound.montantNetHt,
                    impot: invoiceFound.montantNetTTC - invoiceFound.montantNetHt
                })
            }
            if (invoiceFound.Taux_AIB) {
                listTaxe.push({
                    tax: 'AIB(' + invoiceFound.Taux_AIB + '%)',
                    base: invoiceFound.BaseAIB,
                    impot: invoiceFound.AIB
                })
            }
            const doc = new PDFDocument({ size: 'A4' });

            const pageWidth = 570
            const pageHeigth = 841.89

            const psociete = await pSocieteRepository.findOne({
                where:{
                    id : Not(0)
                }
            })
            // HTTP response
            var finalString = ''; // contains the base64 string
            var stream = doc.pipe(new Base64Encode());

            doc.fontSize(10).font('Courier-Bold')
                .text(invoiceFound.codeMECeFDGI ? "FACTURE" : "FACTURE PROFORMA", 10, 50, { align: 'right', width: pageWidth })
            doc.moveDown();
            doc.font('Courier-Bold').text(psociete.raisonSociale, { align: 'right', width: pageWidth })
            doc.font('Courier').text(psociete.adresse, { align: 'right', width: pageWidth })
            doc.text("TEL : " + psociete.tel1 ? psociete.tel1 : '' + " " + psociete.tel2, { align: 'right', width: pageWidth })
            doc.text("EMAIL : " + psociete.email, { align: 'right', width: pageWidth })
            doc.moveDown(5);
            doc.lineWidth(0.1).moveTo(10, doc.y)
                .lineTo(pageWidth, doc.y)
                .stroke()
            doc.moveDown();

            // Informations clients
            doc.font('Courier-Bold')
                .text(invoiceFound.marche.dao.tiers.numero + ' ' + invoiceFound.marche.dao.tiers.intitule, 10, 180, { align: 'left', width: pageWidth / 2 })
            doc.font('Courier')
                .text(invoiceFound.marche.dao.tiers.adresse, 10, 195, { align: 'left', width: pageWidth / 2 })
            doc.font('Courier')
                .text(invoiceFound.marche.dao.tiers.ville + ' ' + invoiceFound.marche.dao.tiers.region, 10, 210, { align: 'left', width: pageWidth / 2 })
            doc.font('Courier')
                .text('Tel : ' + invoiceFound.marche.dao.tiers.telephone1 + ' ' + invoiceFound.marche.dao.tiers.telephone2, 10, 225, { align: 'left', width: pageWidth / 2 })
            doc.font('Courier')
                .text('Email : ' + invoiceFound.marche.dao.tiers.email, 10, 240, { align: 'left', width: pageWidth / 2 })

            // Informations factures
            doc.font('Courier-Bold').text("Numero facture : ", pageWidth / 2, 180, { align: 'right', width: 185 })
            doc.font('Courier').text(invoiceFound.reference, 470, 180, { align: 'right', width: 100 })
            doc.font('Courier-Bold').text("Date facture : ", pageWidth / 2, 195, { align: 'right', width: 185 })
            doc.font('Courier').text(formatDate.format(invoiceFound.dateCreated), 470, 195, { align: 'right', width: 100 })
            // Details products
            //entete
            doc.font('Courier-Bold').text("Désignation", 10, 300, { align: 'left', width: 310 })
            doc.font('Courier-Bold').text("Qté", 320, 300, { align: 'center', width: 50 })
            doc.font('Courier-Bold').text("PU.TTC", 370, 300, { align: 'right', width: 80 })
            doc.font('Courier-Bold').text("Montant TTC", 450, 300, { align: 'right', width: 120 })
            doc.moveDown();
            doc.lineWidth(0.1).moveTo(10, doc.y)
                .lineTo(pageWidth, doc.y)
                .stroke()
            // produits
            doc.font('Courier').text(invoiceFound.marche.travaux, 10, 335, { align: 'left', width: 310 })
            doc.font('Courier').text(1, 320, 335, { align: 'center', width: 50 })
            doc.font('Courier').text(formatNumber.format(invoiceFound.montantNetTTC).replace(' ', ' ').replace(' ', ' '), 370, 335, { align: 'right', width: 80 })
            doc.font('Courier').text(formatNumber.format(invoiceFound.montantNetTTC).replace(' ', ' ').replace(' ', ' '), 450, 335, { align: 'right', width: 120 })
            doc.moveDown();
            doc.lineWidth(0.01).moveTo(10, doc.y)
                .lineTo(pageWidth, doc.y)
                .stroke()
            doc.moveDown();

            //sous total
            doc.font('Courier-Oblique').text("--- VENTILATION DES IMPÔTS ---", 10, 390, { align: 'center', width: 250 })
            doc.moveDown();
            doc.font('Courier').text("TAXE", 10, 415, { align: 'left', width: 80 })
            doc.font('Courier').text("BASE", 90, 415, { align: 'right', width: 80 })
            doc.font('Courier').text("IMPOT", 170, 415, { align: 'right', width: 80 })
            doc.lineWidth(0.1).moveTo(10, doc.y)
                .lineTo(250, doc.y)
                .stroke()
            doc.moveDown();
            let y = doc.y
            listTaxe.forEach(tax => {
                doc.font('Courier').text(tax.tax, 10, y, { align: 'left', width: 80 })
                doc.font('Courier').text(formatNumber.format(tax.base).replace(' ', ' ').replace(' ', ' '), 90, y, { align: 'right', width: 80 })
                doc.font('Courier').text(formatNumber.format(tax.impot).replace(' ', ' ').replace(' ', ' '), 170, y, { align: 'right', width: 80 })
                y = y + 15
            })
            doc.moveDown();
            doc.lineWidth(0.1).moveTo(300, 515)
                .lineTo(570, 515)
                .stroke()
            doc.moveDown();
            doc.font('Courier-Bold').text("NET A PAYER : ", 10, 530, { align: 'right', width: 400 })
            doc.font('Courier-Bold').text(formatNumber.format(invoiceFound.netAPayer).replace(' ', ' ').replace(' ', ' '), 400, 530, { align: 'right', width: 170 })
            doc.moveDown();
            doc.lineWidth(0.1).moveTo(300, doc.y)
                .lineTo(570, doc.y)
                .stroke()
            doc.font('Courier')
                .text("Merci pour le paiement dans un délai de quinze(15) jours maximun.", 10, 600, { align: 'center', width: pageWidth })

            if (invoiceFound.codeMECeFDGI) {
                // AFFICHE LES INFOS MECEF
                doc.font('Courier')
                    .text("--- ELEMENT DE SECURITE DE LA FACTURE NORMALISEE ---", 10, 650, { align: 'center', width: pageWidth })

                //doc.rect()
                await QRCode.toFile('./filename.png', invoiceFound.qrcode, {
                }, function (err) {
                    if (err) throw err
                })
                doc.image('./filename.png', 30, 670, { fit: [100, 100] })

                doc.font('Courier').text('Code MECeF/DGI', 100, 680, { align: 'center' })
                doc.font('Courier-Bold').text(invoiceFound.codeMECeFDGI, 100, 695, { align: 'center' })

                doc.font('Courier').text('MECeF NIM :', 170, 710, { align: 'left', width: 200 })
                doc.font('Courier-Bold').text(invoiceFound.NIMMECEF, 250, 710, { align: 'right', width: 200 })
                doc.font('Courier').text('MECeF Compteurs :', 170, 725, { align: 'left', width: 200 })
                doc.font('Courier-Bold').text(invoiceFound.countersMECeF, 250, 725, { align: 'right', width: 200 })
                doc.font('Courier').text('MECeF Heure :', 170, 740, { align: 'left', width: 200 })
                doc.font('Courier-Bold').text(invoiceFound.dateTimeMECeF, 250, 740, { align: 'right', width: 200 })

            }

            doc.end();

            // generation en base 64
            stream.on('data', function (chunk) {
                finalString += chunk;
            });

            stream.on('end', function () {
                // the stream is at its end, so push the resulting base64 string to the response
                return res.send({ description: 'success', data: finalString })
            });

        } catch (error) {
            console.log(error)
            return res.send({ description: 'error', message: error })
        }
    }

}