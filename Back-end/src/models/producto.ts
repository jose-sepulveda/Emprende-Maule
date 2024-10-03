import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Categorias } from "./categoria";

export const Productos = sequelize.define('productos',{
    'cod_producto': {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    'nombre_producto': {type: DataTypes.STRING},
    'precio_producto': {type: DataTypes.INTEGER},
    'cantidad_total': {type: DataTypes.INTEGER},
    'cantidad_disponible': {type: DataTypes.INTEGER},
    'descripcion_producto': {type: DataTypes.STRING},
    'imagen': {type: DataTypes.STRING},
    'id_categoria': {type: DataTypes.INTEGER}
},
    {
        freezeTableName: true,
        timestamps: false
    }
);

Productos.belongsTo(Categorias, {foreignKey: 'id_categoria', onDelete: 'SET NULL'});
