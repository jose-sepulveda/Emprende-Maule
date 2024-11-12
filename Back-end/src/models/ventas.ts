import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Cliente } from "./cliente";

export const Ventas = sequelize.define('ventas', {
    'id_venta': { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'id_cliente': { type: DataTypes.INTEGER },
    'fecha_venta': { type: DataTypes.DATE },
    'subtotal': { type: DataTypes.INTEGER },
    'iva': { type: DataTypes.INTEGER },
    'descuentos': { type: DataTypes.INTEGER },
    'total': { type: DataTypes.INTEGER },
    'metodo_de_pago': { type: DataTypes.STRING },
    'estado_de_venta': { type: DataTypes.STRING }
}, {
    freezeTableName: true,
    timestamps: false
});

Ventas.belongsTo(Cliente, { foreignKey: 'id_cliente', onDelete: 'SET NULL' });