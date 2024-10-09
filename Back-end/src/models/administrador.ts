import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Administrador = sequelize.define('administrador',{
    "id_administrador": {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    "rut_administrador": {type: DataTypes.STRING},
    "contrasena": {type: DataTypes.STRING},
    "nombre_administrador": {type: DataTypes.STRING},
    "apellido1_administrador": {type: DataTypes.STRING},
    "apellido2_administrador": {type: DataTypes.STRING}

},
{
    timestamps: false,
    freezeTableName: true
});