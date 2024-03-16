import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { logErrors, errorHandler } from './utils.js';
import { apiRouter } from './api/api.router.js';
import { amqpService } from './messageBroker/amqpService.js';

import { db } from './database/main.js';


const PORT = process.env.PORT;



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRouter);


app.use((req, res, next) => {
    res.status(404).send('Not Found');
});


app.use(logErrors);
app.use(errorHandler);



process.on('exit', () => {
    amqpService.close();
});



app.listen(PORT, () => {
    console.log(`Api is running on port ${PORT}`);
});
