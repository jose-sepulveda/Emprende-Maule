"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Productos = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const categoria_1 = require("./categoria");
exports.Productos = connection_1.default.define('productos', {
    'cod_producto': { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    'nombre_producto': { type: sequelize_1.DataTypes.STRING },
    'precio_producto': { type: sequelize_1.DataTypes.INTEGER },
    'cantidad_total': { type: sequelize_1.DataTypes.INTEGER },
    'cantidad_disponible': { type: sequelize_1.DataTypes.INTEGER },
    'descripcion_producto': { type: sequelize_1.DataTypes.STRING },
    'imagen': { type: sequelize_1.DataTypes.STRING },
    'id_categoria': { type: sequelize_1.DataTypes.INTEGER }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.Productos.belongsTo(categoria_1.Categorias, { foreignKey: 'id_categoria', onDelete: 'SET NULL' });
