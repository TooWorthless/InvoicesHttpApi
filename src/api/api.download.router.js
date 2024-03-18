import { Router } from 'express';
import { apiController } from './api.controller.js';


const apiDownloadRouter = Router();


apiDownloadRouter.get('/invoices/:id', apiController.downloadInvoiceById);
apiDownloadRouter.get('/invoices', apiController.downloadInvoices);


export {
    apiDownloadRouter
};