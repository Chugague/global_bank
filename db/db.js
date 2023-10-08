//Importamos los paquetes para nuestra base de datos
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

//Creanos la configuracion de la base de datos
const createPool = async () => {
    return await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
};

export {createPool};