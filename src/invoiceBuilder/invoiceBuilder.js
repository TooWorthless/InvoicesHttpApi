import PDFDocument from 'pdfkit-table';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


class InvoiceBuilder {
    constructor() {
        this.invoiceId = uuidv4();
        this.doc = new PDFDocument({ margin: 60, size: 'A4' });
        this.doc.pipe(fs.createWriteStream(`./invoices/${this.invoiceId}.pdf`));
    }


    async build(data) {
        this.doc.font(`./fonts/arial.ttf`).fontSize(20).text('Invoice', { align: 'center' });
        this.doc.moveDown();

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
        this.doc.font(`./fonts/arial.ttf`).table(table, {
            divider: {
                header: { disabled: true },
                horizontal: { disabled: true },
            },
            prepareHeader: () => this.doc.fontSize(15),
            prepareRow: () => this.doc.fontSize(10)
        });
    
        this.doc.moveDown().fontSize(15).text(`Total: $${total}`, { align: 'right' });
    
        this.doc.end();
    }
}


export {
    InvoiceBuilder
}