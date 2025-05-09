// src/config/database.js
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config({path: '../../.env'});


const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'mysql',
  logging: false
});

export default sequelize;
