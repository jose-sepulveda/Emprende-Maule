import { DataTypes } from "sequelize";
import sequelize from "../database/connection";


export const Contacto = sequelize.define('contacto', {
    "id_contacto": {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
    "nombre": {type: DataTypes.STRING},
    "correo": {type: DataTypes.STRING},
    "categoria_consulta": {type: DataTypes.STRING},
    "mensaje": {type: DataTypes.STRING},
    "estado": {type: DataTypes.STRING, defaultValue: 'Pendiente'},
});