"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedidos = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const producto_1 = require("./producto");
const ventas_1 = require("./ventas");
const cliente_1 = require("./cliente");
const emprendedor_1 = require("./emprendedor");
exports.Pedidos = connection_1.default.define('pedidos', {
    'id_pedido': { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'cod_producto': { type: sequelize_1.DataTypes.INTEGER },
    'id_venta': { type: sequelize_1.DataTypes.INTEGER },
    'id_cliente': { type: sequelize_1.DataTypes.INTEGER },
    'id_emprendedor': { type: sequelize_1.DataTypes.INTEGER },
    'estado_pedido': { type: sequelize_1.DataTypes.STRING }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.Pedidos.belongsTo(producto_1.Productos, { foreignKey: 'cod_producto', onDelete: 'SET NULL' });
exports.Pedidos.belongsTo(ventas_1.Ventas, { foreignKey: 'id_venta', onDelete: 'SET NULL' });
exports.Pedidos.belongsTo(cliente_1.Cliente, { foreignKey: 'id_cliente', onDelete: 'SET NULL' });
exports.Pedidos.belongsTo(emprendedor_1.Emprendedor, { foreignKey: 'id_emprendedor', onDelete: 'SET NULL' });
