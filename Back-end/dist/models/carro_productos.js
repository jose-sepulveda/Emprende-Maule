"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carro_productos = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const carro_1 = require("./carro");
const producto_1 = require("./producto");
exports.Carro_productos = connection_1.default.define('carro_productos', {
    "id_carro_productos": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "cod_producto": { type: sequelize_1.DataTypes.INTEGER },
    "cantidad": { type: sequelize_1.DataTypes.INTEGER },
    "subtotal": { type: sequelize_1.DataTypes.INTEGER },
    "id_carro": { type: sequelize_1.DataTypes.INTEGER },
}, {
    timestamps: false,
    freezeTableName: true
});
exports.Carro_productos.belongsTo(producto_1.Productos, { foreignKey: "cod_producto", onDelete: "CASCADE" });
exports.Carro_productos.belongsTo(carro_1.Carro, { foreignKey: "id_carro", onDelete: "CASCADE" });
