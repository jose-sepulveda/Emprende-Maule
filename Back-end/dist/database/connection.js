"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('Emprende-Maule', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});
exports.default = sequelize;
