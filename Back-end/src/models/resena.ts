import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Cliente } from "./cliente";
import { Productos } from "./producto";

export const Resena = sequelize.define('resena', {
    'id_resena': { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'calificación': { type: DataTypes.INTEGER },
    'resena': { type: DataTypes.STRING },
    'id_cliente': { type: DataTypes.INTEGER },
    'cod_producto': { type: DataTypes.INTEGER }
}, {
    freezeTableName: true,
    timestamps: false
});

Resena.belongsTo(Cliente, { foreignKey: 'id_cliente', onDelete: 'SET NULL' });
Resena.belongsTo(Productos, { foreignKey: 'cod_producto', onDelete: 'SET NULL' });
