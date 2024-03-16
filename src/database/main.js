import { Sequelize } from 'sequelize';
import { Invoice } from './models/invoice.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlitedb/db.sqlite'
});


const db = {
    Invoice: Invoice(sequelize)
};


export {
    db,
    sequelize
};