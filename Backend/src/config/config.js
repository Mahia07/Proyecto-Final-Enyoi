// src/config/database.js
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize';

dotenv.config()

const sequelize = new Sequelize(
  'railway', 
  'root',    
  'fCPbbnJPiiOceMIygqVoLXJBWKLCpflY',
  {
    host: 'tramway.proxy.rlwy.net',
    port: 28337,
    dialect: 'mysql',
    logging: false
  }
);

export default sequelize;