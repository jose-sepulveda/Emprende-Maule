"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contacto = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Contacto = connection_1.default.define('contacto', {
    "id_contacto": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "nombre": { type: sequelize_1.DataTypes.STRING },
    "correo": { type: sequelize_1.DataTypes.STRING },
    "categoria_consulta": { type: sequelize_1.DataTypes.STRING },
    "mensaje": { type: sequelize_1.DataTypes.STRING },
    "estado": { type: sequelize_1.DataTypes.STRING, defaultValue: 'Pendiente' },
});
