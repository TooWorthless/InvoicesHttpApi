import { DataTypes } from 'sequelize';


function Invoice(sequelize) {
    const Invoice = sequelize.define('Invoice', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING
        },
        invoice: {
            type: DataTypes.TEXT
        }
    }, { modelName: 'Invoice' });

    return Invoice;
}


export { 
    Invoice 
};