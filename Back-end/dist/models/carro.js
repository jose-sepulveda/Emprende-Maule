"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carro = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const cliente_1 = require("./cliente");
exports.Carro = connection_1.default.define('carro', {
    "id_carro": { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "id_cliente": { type: sequelize_1.DataTypes.INTEGER },
    "total": { type: sequelize_1.DataTypes.INTEGER }
}, {
    freezeTableName: true,
    timestamps: false,
});
exports.Carro.belongsTo(cliente_1.Cliente, { foreignKey: 'id_cliente', onDelete: 'CASCADE' });
