import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export const Category = sequelize.define(
    "Category", 
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING, allowNull: true, unique: true},
        description: {type: DataTypes.STRING, allowNull: true}
    }
)