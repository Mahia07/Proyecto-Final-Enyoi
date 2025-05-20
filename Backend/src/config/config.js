// src/config/database.js
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
  'railway', 
  'root',    
  'tjywJKpiKxfCPYhZVUBZEVNaKgJOOCoe', 
  {
    host: 'ballast.proxy.rlwy.net', 
    port: 40523,                    
    dialect: 'mysql',
    logging: false
  }
);

export default sequelize;
