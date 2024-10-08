import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Carro } from "./carro";
import { Productos } from "./producto";

export const Carro_productos = sequelize.define('carro_productos', {
    "id_carro_productos": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "cod_producto": { type: DataTypes.INTEGER },
    "cantidad": { type: DataTypes.INTEGER},
    "subtotal": { type: DataTypes.INTEGER},
    "id_carro": { type: DataTypes.INTEGER},
}, {
    timestamps: false,
    freezeTableName: true
});

Carro_productos.belongsTo(Productos, {foreignKey: "cod_producto", onDelete: "CASCADE"});
Carro_productos.belongsTo(Carro, {foreignKey: "id_carro", onDelete: "CASCADE"});