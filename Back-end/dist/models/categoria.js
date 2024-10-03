"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categorias = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Categorias = connection_1.default.define('categorias', {
    "id_categoria": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "nombre_categoria": { type: sequelize_1.DataTypes.STRING },
    "estado_categoria": { type: sequelize_1.DataTypes.BOOLEAN },
}, {
    freezeTableName: true,
    timestamps: false,
});
