import cron from 'node-cron';
import { pool } from '../data/database.js';

export const releaseTracksCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const result = await pool.query(`
                UPDATE album
                SET status = 'available'
                WHERE status = 'pending'
                    AND release
            `);


        } catch(err) {
            console.error('[CRON] Error publishing tracks:', err);
        }
    });
}