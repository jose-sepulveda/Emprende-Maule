import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';
import { Cliente } from './cliente';

export const Carro = sequelize.define(
    'carro',
    {
        "id_carro": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        "id_cliente": { type: DataTypes.INTEGER },
        "total": { type: DataTypes.INTEGER}
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Carro.belongsTo(Cliente, { foreignKey: 'id_cliente', onDelete: 'CASCADE' });