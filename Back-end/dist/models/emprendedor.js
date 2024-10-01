"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emprendedor = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Emprendedor = connection_1.default.define('emprendedor', {
    "id_emprendedor": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "rut_emprendedor": { type: sequelize_1.DataTypes.STRING },
    "contrasena": { type: sequelize_1.DataTypes.STRING },
    "nombre_emprendedor": { type: sequelize_1.DataTypes.STRING },
    "apellido1_emprendedor": { type: sequelize_1.DataTypes.STRING },
    "apellido2_emprendedor": { type: sequelize_1.DataTypes.STRING },
    "direccion": { type: sequelize_1.DataTypes.STRING },
    "telefono": { type: sequelize_1.DataTypes.INTEGER },
    "correo_electronico": { type: sequelize_1.DataTypes.STRING },
    "imagen_productos": { type: sequelize_1.DataTypes.STRING },
    "imagen_local": { type: sequelize_1.DataTypes.STRING },
    "comprobante": { type: sequelize_1.DataTypes.STRING },
    "tipo_de_cuenta": { type: sequelize_1.DataTypes.STRING },
    "numero_de_cuenta": { type: sequelize_1.DataTypes.INTEGER },
    "estado_emprendedor": { type: sequelize_1.DataTypes.STRING }
}, {
    timestamps: false,
    freezeTableName: true
});
