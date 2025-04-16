import sequelize from "../config/config.js";
import { Users } from "../models/users.js";
import { Tasks } from "../models/tasks.js";

export const initializeData = async () => {
    try {
        await sequelize.sync({alter:true})
        const user = await Users.bulkCreate([
            {
                id: 1,
                name: 'Catalina Torres',
                email: 'Cata@ejemplo',
                password: 'CatalinaTorres'
            },
            {
                id: 2,
                name: 'Julian Gomez',
                email:'Julian@ejemplo',
                password: 'Julian12345'
            }
        ])
        const tasks = await Tasks.bulkCreate([
            {
                title: 'Crear diseño del frontend',
                description: 'Diseñar la interfaz principal de la app de tareas.',
                status: 'pendiente',
                dateLimit: new Date('2025-05-01'),
                userId: 1 
            },
            {
                title: 'Configurar autenticación',
                description: 'Implementar JWT y login de usuarios.',
                status: 'proceso',
                dateLimit: new Date('2025-05-05'),
                userId: 2
            },
            {
                title: 'Testeo de endpoints',
                description: 'Probar todas las rutas del backend con Postman.',
                status: 'completada',
                dateLimit: null,
                userId: 1
            }
        ]);
    } catch (error) {
       
    }
}
initializeData();