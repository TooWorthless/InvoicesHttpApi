import PDFDocument from 'pdfkit-table';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


class InvoiceBuilder {
    constructor() {
        this.invoiceId = uuidv4();
        this.pdfPath = `./invoices/${this.invoiceId}.pdf`;
        this.margin = 60;
        this.size = 'A4';
    }

    async build(data) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: this.margin, size: this.size });
            const writeStream = fs.createWriteStream(this.pdfPath);
            doc.pipe(writeStream);

            doc.font(`./fonts/arial.ttf`).fontSize(20).text('Invoice', { align: 'center' });
            doc.moveDown();

            let total = 0;

            const table = {
                headers: [
                    { label: 'Name', property: 'description', width: 60, renderer: null, headerColor: 'white' },
                    { label: 'Quantity', property: 'quantity', width: 90, renderer: null, headerColor: 'white' },
                    { label: 'Price', property: 'price', width: 60, renderer: null, headerColor: 'white' },
                    { label: 'Total', property: 'total', width: 60, renderer: null, headerColor: 'white' }
                ],
                datas: data.map((item) => {
                    const itemTotal = +item.price * +item.quantity;
                    total += itemTotal;
                    item.total = '$' + itemTotal;
                    item.price = '$' + item.price;
                    return item;
                })
            };
            doc.font(`./fonts/arial.ttf`).table(table, {
                divider: {
                    header: { disabled: true },
                    horizontal: { disabled: true },
                },
                prepareHeader: () => doc.fontSize(15),
                prepareRow: () => doc.fontSize(10)
            });

            doc.moveDown().fontSize(15).text(`Total: $${total}`, { align: 'right' });

            doc.end();

            writeStream.on('finish', () => {
                resolve(this.pdfPath);
            });

            doc.on('error', (error) => {
                reject(error);
            });
        });
    }
}


export {
    InvoiceBuilder
}