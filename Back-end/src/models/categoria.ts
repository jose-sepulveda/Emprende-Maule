import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Categorias = sequelize.define('categorias',{
    "id_categoria": {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    "nombre_categoria": {type: DataTypes.STRING},
    "estado_categoria": {type: DataTypes.BOOLEAN},
},
{
    freezeTableName: true,
    timestamps: false,
}
)