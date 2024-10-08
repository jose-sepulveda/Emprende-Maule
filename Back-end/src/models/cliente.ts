import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export const Cliente = sequelize.define('cliente',{
    "id_cliente": {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    "rut_cliente": {type: DataTypes.STRING},
    "contrasena": {type: DataTypes.STRING},
    "nombre_cliente": {type: DataTypes.STRING},
    "apellido1_cliente": {type: DataTypes.STRING},
    "apellido2_cliente": {type: DataTypes.STRING},
    "direccion": {type: DataTypes.STRING},
    "telefono": {type: DataTypes.STRING},
    "correo": {type: DataTypes.STRING},
    "estado_cliente": {type: DataTypes.BOOLEAN, defaultValue: false}
},
{
    timestamps: false,
    freezeTableName: true
});
