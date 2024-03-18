import { Router } from 'express';
import { apiController } from './api.controller.js';
import { apiDownloadRouter } from './api.download.router.js';


const apiRouter = Router();


apiRouter.get('/invoices', apiController.getInvoices);
apiRouter.get('/invoices/:id', apiController.getInvoiceById);
apiRouter.delete('/invoices/:id', apiController.deleteInvoiceById);
apiRouter.use('/download', apiDownloadRouter);


export {
    apiRouter
};