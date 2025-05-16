// src/config/database.js
import { Sequelize } from 'sequelize';

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
