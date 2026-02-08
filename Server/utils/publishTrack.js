import cron from 'node-cron';
import { pool } from '../data/database.js';

export const releaseTracksCron = () => {
    cron.schedule('5 0 * * *', async () => {
        try {
            const result = await pool.query(`
                WITH updated_albums AS (
                        UPDATE album
                        SET status = 'available',
                            date_updated = CURRENT_DATE
                        WHERE status = 'pending'
                        AND release_date <= CURRENT_DATE
                    RETURNING id, title, album_type, release_date
                    )
                    UPDATE audio
                    SET status = 'available',
                        date_updated = CURRENT_DATE
                    FROM album_audio aa
                    JOIN updated_albums ua ON aa.album_id = ua.id
                    WHERE audio.id = aa.audio_id
                    AND audio.status = 'pending'
                RETURNING audio.id AS audio_id,
                        audio.title AS audio_title,
                        ua.id AS album_id,
                        ua.title AS album_title;
            `);

            const updatedCount = result.rowCount;

            if (updatedCount > 0) {
                console.log(`[CRON] ${updatedCount} album(s) released today: `);
                
                const byAlbum = {};
                result.rows.forEach(r => {
                    if (!byAlbum[r.album_id]) {
                        byAlbum[r.album_id] = { title: r.album_title, tracks: [] };
                    }
                    byAlbum[r.album_id].tracks.push(r.audio_title || `Track ${r.audio_id}`);
                });

                Object.entries(byAlbum).forEach(([albumId, data]) => {
                    console.log(`  Album ${albumId} (${data.title}):`);
                    data.tracks.forEach(t => console.log(`    - ${t}`));
                });
                
            } else {
                console.log(`[CRON] No albums to release today.`);
            }

        } catch(err) {
            console.error('[CRON] Error publishing tracks:', err);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Manila"
    });

    console.log('[CRON] Album auto-release scheduler started (daily at 00:05)');
}