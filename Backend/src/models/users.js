import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export const Users = sequelize.define(
    "Users", 
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING, allowNull:false},
        email: {type: DataTypes.STRING, unique: true, allowNull:false},
        password: {type: DataTypes.STRING, allowNull:false},
        photo: {type: DataTypes.STRING, allowNull: true}
    }
)