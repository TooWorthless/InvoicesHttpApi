import amqp from 'amqplib';
import fs from 'fs';
import { InvoiceBuilder } from '../invoiceBuilder/invoiceBuilder.js';
import { db } from '../database/main.js';
import dotenv from 'dotenv';
dotenv.config();



class AMQPService {

    constructor() {
        this.connection = null;
        this.channels = {};
    }


    async connect() {
        try {
            const { rabbitmq_username, rabbitmq_password, IP, AMQP_PORT } = process.env;

            this.connection = await amqp.connect(
                `amqp://${rabbitmq_username}:${rabbitmq_password}@${IP}:${AMQP_PORT}`
            );
            this.channels.processingChannel = {
                channel: await this.connection.createChannel(),
                exchange: 'invoicesProcessing'
            };
            this.channels.receivingChannel = {
                channel: await this.connection.createChannel(),
                exchange: 'invoicesReceiving'
            };

            for(const channelKey in this.channels) {
                await this.channels[channelKey].channel.assertExchange(
                    this.channels[channelKey].exchange,
                    'direct', 
                    { durable: false }
                );
            }

        } catch (error) {
            console.error('Error connecting to AMQP :>> ', error.stack);
            throw error;
        }
    }


    publish(data, queueKey) {
        if(!this.channels.receivingChannel.channel) {
            throw new Error('Channel not initialized. Please call connect() first.');
        }

        this.channels.receivingChannel.channel.publish(this.channels.receivingChannel.exchange, queueKey, Buffer.from(data));
        // console.log(' [x] Sent %s', data);
    }


    async createQueueAndBind(queueKey) {
        try {
            const assertedQueue = await this.channels.processingChannel.channel.assertQueue('', { exclusive: true });

            await this.channels.processingChannel.channel.bindQueue(assertedQueue.queue, this.channels.processingChannel.exchange, queueKey);
            
            this.channels.processingChannel.channel.consume(
                assertedQueue.queue,
                async (invoice) => {
                    if (invoice.content) {
                        const data = JSON.parse(invoice.content.toString());
                        console.log('Invoice data :>> ', data);

                        const pdfInvoice = new InvoiceBuilder();
                        const pdfPath = await pdfInvoice.build(data.invoice);

                        const pdfInvoiceFile = await fs.promises.readFile(`./invoices/${pdfInvoice.invoiceId}.pdf`);
                        
                        const newInvoice = await db.Invoice.create({
                            key: pdfInvoice.invoiceId,
                            invoice: JSON.stringify(data)
                        });
                        console.log('newInvoice :>> ', newInvoice.dataValues);
                        
                        this.publish(pdfInvoiceFile, data.connectionId); 
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
                for(const channelKey in this.channels) {
                    await this.channels[channelKey].channel.close();
                }
                await this.connection.close();
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
