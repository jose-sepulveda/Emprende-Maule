"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ventas = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const cliente_1 = require("./cliente");
exports.Ventas = connection_1.default.define('ventas', {
    'id_venta': { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'id_cliente': { type: sequelize_1.DataTypes.INTEGER },
    'fecha_venta': { type: sequelize_1.DataTypes.DATE },
    'subtotal': { type: sequelize_1.DataTypes.INTEGER },
    'iva': { type: sequelize_1.DataTypes.INTEGER },
    'descuentos': { type: sequelize_1.DataTypes.INTEGER },
    'total': { type: sequelize_1.DataTypes.INTEGER },
    'metodo_de_pago': { type: sequelize_1.DataTypes.STRING },
    'estado_de_venta': { type: sequelize_1.DataTypes.STRING }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.Ventas.belongsTo(cliente_1.Cliente, { foreignKey: 'id_cliente', onDelete: 'SET NULL' });
