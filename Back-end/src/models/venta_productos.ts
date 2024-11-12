import {DataTypes} from 'sequelize';
import sequelize from '../database/connection';
import {Ventas} from './ventas';
import {Productos} from './producto';

export const Venta_productos = sequelize.define('venta_productos', {
    "id_venta_productos": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    "id_venta": { type: DataTypes.INTEGER },
    "cod_producto": { type: DataTypes.INTEGER},
    "cantidad": { type: DataTypes.INTEGER},
}, {
    timestamps: false,
    freezeTableName: true
});

Venta_productos.belongsTo(Ventas, {foreignKey: "id_venta", onDelete: "SET NULL"});
Venta_productos.belongsTo(Productos, {foreignKey: "cod_producto", onDelete: "SET NULL"});
