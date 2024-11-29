import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Productos } from "./producto";
import { Ventas } from "./ventas";
import { Cliente } from "./cliente";
import { Emprendedor } from "./emprendedor";
import { Venta_productos } from "./venta_productos";

export const Pedidos = sequelize.define('pedidos', {
    'id_pedido': { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'cod_producto': { type: DataTypes.INTEGER },
    'id_venta': { type: DataTypes.INTEGER },
    'id_cliente': { type: DataTypes.INTEGER },
    'id_emprendedor': { type: DataTypes.INTEGER },
    'id_venta_productos': { type: DataTypes.INTEGER },
    'estado_pedido': { type: DataTypes.STRING }
}, {
    freezeTableName: true,
    timestamps: false
});

Pedidos.belongsTo(Productos, { foreignKey: 'cod_producto', onDelete: 'SET NULL' });
Pedidos.belongsTo(Ventas, { foreignKey: 'id_venta', onDelete: 'SET NULL' });
Pedidos.belongsTo(Cliente, { foreignKey: 'id_cliente', onDelete: 'SET NULL' });
Pedidos.belongsTo(Emprendedor, { foreignKey: 'id_emprendedor', onDelete: 'SET NULL' });
Pedidos.belongsTo(Venta_productos, { foreignKey: 'id_venta_productos', onDelete: 'SET NULL' });