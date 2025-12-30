import pgPromise from 'pg-promise';
import pgSession from 'connect-pg-simple';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();



// initialize pg-promise first
const pgp = new pgPromise();

export const pool = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})


// using session with Postgres
const PgSession = pgSession(session);
export const sessionStore = new PgSession({
    pool,
    tableName: 'session',
});




export async function testConnection() {
    try {
        await pool.one('SELECT 1');
        console.log('Connected to POSTGRES successfully!');

    } catch (err) {
        console.error('Error connecting to POSTGRES: ', err.message);
    }
}