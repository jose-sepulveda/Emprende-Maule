"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrador = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Administrador = connection_1.default.define('administrador', {
    "id_administrador": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "rut_administrador": { type: sequelize_1.DataTypes.STRING },
    "contrasena": { type: sequelize_1.DataTypes.STRING },
    "nombre_administrador": { type: sequelize_1.DataTypes.STRING },
    "apellido1_administrador": { type: sequelize_1.DataTypes.STRING },
    "apellido2_administrador": { type: sequelize_1.DataTypes.STRING },
    "correo": { type: sequelize_1.DataTypes.STRING }
}, {
    timestamps: false,
    freezeTableName: true
});
