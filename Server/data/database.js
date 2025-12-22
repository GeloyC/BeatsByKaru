import mysql from 'mysql2/promise';
import MySQLStore from 'express-mysql-session';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();




export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit: 10,
    queueLimit:0,
})


const MySQLSessionStore = MySQLStore(session);
export const sessionStore = new MySQLSessionStore(
    {
        clearExpired: true,
        checkExpirationInterval: 900000, // 15 Minutes
        expiration: 1000 * 60 * 60 * 24 * 7 // 7 Days
    },
    pool
);


export async function testConnection() {
    try {
        const conenction = await pool.getConnection();
        console.log('Connected to database successfully!');

        conenction.release();
    } catch (err) {
        console.error('Error connecting to database: ', err.messsage);
    }
}