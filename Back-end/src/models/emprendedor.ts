import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Emprendedor = sequelize.define('emprendedor', {
    "id_emprendedor": {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    "rut_emprendedor": {type: DataTypes.STRING},
    "contrasena": {type: DataTypes.STRING},
    "nombre_emprendedor": {type: DataTypes.STRING},
    "apellido1_emprendedor": {type: DataTypes.STRING},
    "apellido2_emprendedor": {type: DataTypes.STRING},
    "direccion": {type: DataTypes.STRING},
    "telefono": {type: DataTypes.INTEGER},
    "correo_electronico": {type: DataTypes.STRING},
    "imagen_productos": {type: DataTypes.STRING},
    "imagen_local": {type: DataTypes.STRING},
    "comprobante": {type: DataTypes.STRING},
    "tipo_de_cuenta": {type: DataTypes.STRING},
    "numero_de_cuenta": {type: DataTypes.INTEGER},
    "estado_emprendedor": {type: DataTypes.STRING}
},
{
    timestamps: false,
    freezeTableName: true
});