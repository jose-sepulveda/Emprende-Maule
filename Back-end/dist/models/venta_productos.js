"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venta_productos = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const ventas_1 = require("./ventas");
const producto_1 = require("./producto");
exports.Venta_productos = connection_1.default.define('venta_productos', {
    "id_venta_productos": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "id_venta": { type: sequelize_1.DataTypes.INTEGER },
    "cod_producto": { type: sequelize_1.DataTypes.INTEGER },
    "cantidad": { type: sequelize_1.DataTypes.INTEGER },
}, {
    timestamps: false,
    freezeTableName: true
});
exports.Venta_productos.belongsTo(ventas_1.Ventas, { foreignKey: "id_venta", onDelete: "SET NULL" });
exports.Venta_productos.belongsTo(producto_1.Productos, { foreignKey: "cod_producto", onDelete: "SET NULL" });
