import express from 'express';
import sequelize from '../config/config.js';
import cors from 'cors';
import { defineRelations } from '../models/relations.js';
import { initializeData } from '../mocks/datamock.js';
import colors from 'colors';
import router from './routes.js';

const app = express();
const port = 3000;

app.use(express.json());


app.use(cors({
  origin: [
    'https://proyecto-final-enyoi-qvop.vercel.app',
    'https://proyecto-final-enyoi-c64z.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] 
}));


app.use(router);

async function main() {
  try {
    defineRelations();

    await sequelize.sync({ alter: false });
    console.log('Base de datos sincronizada con éxito'.rainbow);

    console.log('Insertando datos...'.magenta);
    await initializeData();

    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`.yellow);
    });

    console.log('Conexión a la base de datos exitosa'.cyan);
  } catch (error) {
    console.log('Error de conexión a la base de datos'.red, error);
  }
}

main();
