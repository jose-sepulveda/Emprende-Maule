import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Categorias } from "./categoria";
import { Emprendedor } from "./emprendedor";

export const Productos = sequelize.define('productos',{
    'cod_producto': {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    'nombre_producto': {type: DataTypes.STRING},
    'precio_producto': {type: DataTypes.INTEGER},
    'descuento': {type: DataTypes.INTEGER},
    'precio_descuento': {type: DataTypes.BIGINT},
    'cantidad_disponible': {type: DataTypes.INTEGER},
    'descripcion_producto': {type: DataTypes.STRING},
    'imagen': {type: DataTypes.STRING},
    'id_categoria': {type: DataTypes.INTEGER},
    'id_emprendedor': {type: DataTypes.INTEGER}
},
    {
        freezeTableName: true,
        timestamps: false
    }
);

Productos.belongsTo(Categorias, {foreignKey: 'id_categoria', onDelete: 'SET NULL'});
Productos.belongsTo(Emprendedor, {foreignKey: 'id_emprendedor', onDelete: 'SET NULL'});
