// src/config/database.js
import { Sequelize } from 'sequelize';

const DB_URL = 'mysql://root:fCPbbnJPiiOceMIygqVoLXJBWKLCpflY@tramway.proxy.rlwy.net:28337/railway';

console.log('URL BASE DE DATOS', DB_URL);

const sequelize = new Sequelize(DB_URL, {
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
