import {DataTypes} from 'sequelize' 
import sequelize from '../config/config.js'

export const Tasks = sequelize.define(
    "Tasks", 
    {
        id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        title: {type: DataTypes.STRING, allowNull:false},
        description: {type: DataTypes.TEXT},
        status: {type: DataTypes.ENUM('pendiente', 'proceso', 'completada'), defaultValue: 'pendiente'},
        dateCreated: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        dateLimit: {type: DataTypes.DATE, allowNull:true}
         }
)