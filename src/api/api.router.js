import { Router } from 'express';
import { apiController } from './api.controller.js';
import { apiDownloadRouter } from './api.download.router.js';


const apiRouter = Router();


apiRouter.get('/getInvoices', apiController.getInvoices);
apiRouter.get('/getInvoiceById', apiController.getInvoiceById);
apiRouter.post('/deleteInvoiceById', apiController.deleteInvoiceById);
apiRouter.use('/download', apiDownloadRouter);


export {
    apiRouter
};