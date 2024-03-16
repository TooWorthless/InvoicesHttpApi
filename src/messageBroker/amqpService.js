import amqp from 'amqplib';
import { InvoiceBuilder } from '../invoiceBuilder/invoiceBuilder.js';
import { db } from '../database/main.js';
import dotenv from 'dotenv';
dotenv.config();



class AMQPService {

    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchange = 'invoices';
    }


    async connect() {
        try {
            const { rabbitmq_username, rabbitmq_password, IP, AMQP_PORT } = process.env;

            this.connection = await amqp.connect(
                `amqp://${rabbitmq_username}:${rabbitmq_password}@${IP}:${AMQP_PORT}`
            );
            this.channel = await this.connection.createChannel();

            this.channel.assertExchange(
                this.exchange, 
                'direct', 
                { durable: false }
            );
        } catch (error) {
            console.error('Error connecting to AMQP :>> ', error.stack);
            throw error;
        }
    }


    async createQueueAndBind(queueKey) {
        try {
            const assertedQueue = await this.channel.assertQueue('', { exclusive: true });

            await this.channel.bindQueue(assertedQueue.queue, this.exchange, queueKey);
            
            this.channel.consume(
                assertedQueue.queue,
                async (invoice) => {
                    if (invoice.content) {
                        const data = JSON.parse(invoice.content.toString());
                        console.log(data);


                        const pdfInvoice = new InvoiceBuilder();
                        pdfInvoice.build(data);

                        const newInvoice = await db.Invoice.create({
                            key: pdfInvoice.invoiceId,
                            invoice: JSON.stringify(data)
                        });
                        
                        console.log('newInvoice :>> ', newInvoice.dataValues);
                    }
                },
                { noAck: true }
            );

            return assertedQueue.queue;
        } catch (error) {
            console.error('Error creating queue and binding :>> ', error.stack);
            throw error;
        }
    }


    async close() {
        if(this.connection) {
            try {
                await this.connection.close();
                await this.channel.close();
            } catch (error) {
                console.error('Error closing AMQP connection :>> ', error.stack);
            }
        }
    }
    
}



const amqpService = new AMQPService();
await amqpService.connect();
await amqpService.createQueueAndBind('invoice');



export {
    amqpService
};
