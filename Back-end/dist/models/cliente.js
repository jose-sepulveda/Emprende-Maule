"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Cliente = connection_1.default.define('cliente', {
    "id_cliente": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "rut_cliente": { type: sequelize_1.DataTypes.STRING },
    "contrasena": { type: sequelize_1.DataTypes.STRING },
    "nombre_cliente": { type: sequelize_1.DataTypes.STRING },
    "apellido1_cliente": { type: sequelize_1.DataTypes.STRING },
    "apellido2_cliente": { type: sequelize_1.DataTypes.STRING },
    "direccion": { type: sequelize_1.DataTypes.STRING },
    "telefono": { type: sequelize_1.DataTypes.STRING },
    "correo": { type: sequelize_1.DataTypes.STRING },
    "estado_cliente": { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: false,
    freezeTableName: true
});
