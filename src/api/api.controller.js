import { archive } from '../utils.js';
import { db } from '../database/main.js';
import fs from 'fs';


const apiController = {};


apiController.downloadInvoiceById = async (req, res, next) => {
    try {
        if (!req.params) throw new Error('Incorrect params');

        const data = req.params;

        const invoiceId = data.id;

        const invoices = await db.Invoice.findAll({
            where: {
                id: +invoiceId
            }
        });

        if (invoices.length === 0) {
            throw new Error('Not Found');
        }

        const invoice = invoices[0].dataValues;
        const invoiceFile = await fs.promises.readFile(`./invoices/${invoice.key}.pdf`);

        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename=${invoice.key}.pdf`);
        res.status(200).send(invoiceFile);

    } catch (error) {
        next(error);
    }
};

apiController.downloadInvoices = async (req, res, next) => {
    try {
        archive('./invoices', res);
    } catch (error) {
        next(error);
    }
};

apiController.getInvoiceById = async (req, res, next) => {
    try {
        if (!req.params) throw new Error('Incorrect params');

        const data = req.params;

        const invoiceId = data.id;

        const invoices = await db.Invoice.findAll({
            where: {
                id: +invoiceId
            }
        });

        if (invoices.length === 0) {
            throw new Error('Not Found');
        }

        const invoice = {};
        invoice.items = JSON.parse(invoices[0].dataValues.invoice);
        invoice.key = invoices[0].dataValues.key;

        res.set('Content-Type', 'application/json');
        res.status(200).send(invoice);

    } catch (error) {
        next(error);
    }
};

apiController.getInvoices = async (req, res, next) => {
    try {
        let invoices = await db.Invoice.findAll();
        let resultInvoicesJson = {};

        for (const invoice of invoices) {
            const invoiceData = invoice.dataValues;
            resultInvoicesJson[invoiceData.id.toString()] = {
                iems: JSON.parse(invoiceData.invoice),
                key: invoiceData.key
            }
        }

        res.set('Content-Type', 'application/json');
        res.status(200).send(resultInvoicesJson);

    } catch (error) {
        next(error);
    }
};


apiController.deleteInvoiceById = async (req, res, next) => {
    try {
        if (!req.params) throw new Error('Incorrect params');

        const data = req.params;

        const invoiceId = data.id;

        const invoices = await db.Invoice.findAll({
            where: {
                id: +invoiceId
            }
        });

        if (invoices.length === 0) {
            throw new Error('Not Found');
        }

        const invoice = invoices[0].dataValues;

        const deletedRowsAmount = await db.Invoice.destroy({
            where: {
                id: +invoiceId
            }
        });

        if (deletedRowsAmount === 0) {
            throw new Error('Not Found');
        }


        fs.unlink(`./invoices/${invoice.key}.pdf`, (err) => {
            if (err) {
                console.error(`Error unlinking ${invoice.key}.pdf :>> `, err.stack);
                return;
            }
        });


        res.set('Content-Type', 'application/json');
        res.status(200).send(invoice);

    } catch (error) {
        next(error);
    }
};


export {
    apiController
};