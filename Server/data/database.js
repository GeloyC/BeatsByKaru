import pgPromise from 'pg-promise';
import pgSession from 'connect-pg-simple';
import session from 'express-session';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();



// initialize pg-promise first
const pgp = new pgPromise();

export const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
})

console.log(process.env.DB_PASSWORD?.length);


// using session with Postgres
const PgSession = pgSession(session);
export const sessionStore = new PgSession({
    pool,
    tableName: 'session',
});




export async function testConnection() {
    try {
        await db.one('SELECT 1');
        console.log('Connected to POSTGRES successfully!');

    } catch (err) {
        console.error('Error connecting to POSTGRES: ', err.message);
    }
}