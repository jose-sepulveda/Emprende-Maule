"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resena = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const cliente_1 = require("./cliente");
const producto_1 = require("./producto");
exports.Resena = connection_1.default.define('resena', {
    'id_resena': { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'calificación': { type: sequelize_1.DataTypes.INTEGER },
    'resena': { type: sequelize_1.DataTypes.STRING },
    'id_cliente': { type: sequelize_1.DataTypes.INTEGER },
    'cod_producto': { type: sequelize_1.DataTypes.INTEGER }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.Resena.belongsTo(cliente_1.Cliente, { foreignKey: 'id_cliente', onDelete: 'SET NULL' });
exports.Resena.belongsTo(producto_1.Productos, { foreignKey: 'cod_producto', onDelete: 'SET NULL' });
