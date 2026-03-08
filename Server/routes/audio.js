import express from 'express';
import multer from 'multer';
import { db } from '../data/database.js';
import { requireAdmin } from './user.js';

const audio = express.Router();

// setting up multer for audio/cover art uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Files/Audio');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${extension}`);
    }
});

const upload = multer({
    storage,
    limits : {
        fileSize: 100 * 1024 * 1024
    }, 
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'cover_art') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Cover Art must be an image.'));
            }
        }

        if (file.fieldname === 'untagged' || file.fieldname === 'tagged') {
            if (!file.mimetype.startsWith('audio/')) {
                return cb(new Error('Audio file required!'));
            }
        }

        cb(null, true);
    }
})

// used in Create.jsx
audio.post('/upload-track', requireAdmin, 
    upload.fields([
        {name: 'untagged', maxCount: 1},
        {name: 'tagged', maxCount: 1}
    ]), async (req, res, next) => {

    try {
        const { title, duration, audio_key, bpm, genre_id } = req.body;

        const audio_url_filename = req.files.untagged[0].filename;
        const audio_tagged_filename = req.files.tagged[0].filename;


        const audio_url = `${req.protocol}://${req.get("host")}/audio-uploads/${audio_url_filename}`; 
        const audio_tagged_url = `${req.protocol}://${req.get("host")}/audio-uploads/${audio_tagged_filename}`; 


        if (!req.files?.untagged || !req.files?.tagged) {
            return res.status(400).send('Audio with tag/no tag and Cover art is required.');
        }

        // handling error
        const check_title = await db.any( 'SELECT * FROM audio WHERE title = $1', [title]);
        if (title && title === check_title.title) {
            return res.status(409).send('Duplicate title, use a unique title for the track.');
        }
        
        const upload = await db.one(`
            INSERT INTO audio 
                (title, audio_url, audio_tagged_url, duration, audio_key, bpm) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, title; 
            `,
            [ title,audio_url, audio_tagged_url, duration, audio_key, bpm ]
        );

        console.log('Result upload.id: ', upload.id);
        console.log('Received genre_id: ', genre_id);

        for (const id of genre_id) {
            await db.oneOrNone(`
                INSERT INTO audio_genres (audio_id, genre_id)
                VALUES ($1, $2) ON CONFLICT DO NOTHING
                RETURNING audio_id, genre_id;    
            `, [upload.id, id]);
        };

        return res.status(201).json({
            ...upload,
            ...genre_id,
            message: 'Audio single uploaded sucessfully!'
        });

    } catch(err) {
        console.log('Error uploading audio: ', err);
        next(err);
    }
})


// Upload a single
// Used in CreateSingle.jsx
audio.patch('/single/:id/release', requireAdmin, upload.fields([{name: 'cover_art', maxCount: 1}]),  async (req, res, next) => {
    try {
        const { id } = req.params;
        const { license_id, singleTitle, price, release_date } = req.body;

        const cover_art_url = `${req.protocol}://${req.get("host")}/audio-uploads/${req.files.cover_art[0].filename}`;

        // Error Handling
        if (!id || isNaN(id)) {
            return res.status(400).json({message: 'Missing audio ID'});
        }

        if (!singleTitle?.trim()) {
            return res.status(400).json({message: 'Single title is required'});
        }

        if (!price || isNaN(price) || Number(price) < 0) {
            return res.status(400).json({message: 'Valid non-negative price is required'});
        }

        if (!release_date || isNaN(Date.parse(release_date)) || new Date(release_date) < new Date().setHours(0,0,0,0)) {
            return res.status(400).json({message: 'Valid release date is required'});
        }



        if (!license_id || isNaN(license_id)) {
            res.status(400).json({message: 'Valid license ID is required'});
        }

        if (!req?.files?.cover_art?.[0]) {
            return res.status(400).json({message: 'Cover art required'});
        }


        const result = await db.tx( async tran => {
            const audio = await tran.oneOrNone(`
                UPDATE audio SET    
                    license_id = $1, date_updated = NOW()
                WHERE id = $2
                RETURNING id, status
            `, [ license_id, id ]);

            if (!audio) {
                throw new Error('Audio not found!');
            }


            const single = await tran.one(`
                INSERT INTO album ( title, album_type, cover_art_url, release_date, price )
                VALUES ($1, 'single', $2, $3, $4) 
                RETURNING id
            `, [ singleTitle.trim(), cover_art_url, release_date, price ]);

            await tran.none(`
                INSERT INTO album_audio (audio_id, album_id, track_number)
                VALUES ($1, $2, 1)
                ON CONFLICT DO NOTHING
            `, [ id, single.id ]);

            return { audio, single }
        });

        return res.status(200).json({
            sucess: true,
            message: `Track "${singleTitle}" updated successfully!`,
            data: {
                audio_id: result.audio.id,
                single_id: result.single.id
            }
        });

    } catch (err) {
        res.status(500).send({
            sucess: false,
            message: 'Failed to update track for release due to ', err
        })
        console.log('Error processing request for releasing single: ', err);
        next(err);
    }
});


audio.get('/pending', async (req, res, next) => {
    try {
        const audios = await db.any(`
            SELECT
                a.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', g.id,
                            'name', g.name
                        )
                    ) FILTER (WHERE g.id IS NOT NULL),
                    '[]'
                ) AS genres
            FROM audio a
            LEFT JOIN audio_genres ag
                ON ag.audio_id = a.id
            LEFT JOIN genres g
                ON g.id = ag.genre_id
            WHERE a.status = 'pending'
            GROUP BY a.id
            ORDER BY a.id;
        `);

        return res.status(200).json(audios);

    } catch (err) {
        next(err)
        console.error('Failed to retrieve audio data: ', err);
    }
});


// Retreiving all the details 
// Displays on the catalog page in admin
audio.get('/all', async (req, res, next) => {
    try {
        const audios = await db.any(`
            SELECT
                al.id AS album_id,
                al.title,
                al.album_type,
                al.cover_art_url,
                al.release_date,
                al.status,

                a.id AS audio_id,
                a.duration,
                a.audio_key,
                a.audio_tagged_url,
                a.bpm,
                a.license_id,
                a.date_created,
                a.date_updated,

                aa.track_number

            FROM album_audio aa
            JOIN album al ON al.id = aa.album_id
            JOIN audio a ON a.id = aa.audio_id
            ORDER BY al.id, aa.track_number
        `);

        return res.status(200).json(audios);

    } catch (err) {
        next(err)
        console.error('Failed to retrieve audio data: ', err);
    }
});


audio.get('/available', async (req, res, next) => {
    try {
        const audios = await db.any(`
            SELECT
                a.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', g.id,
                            'name', g.name
                        )
                    ) FILTER (WHERE g.id IS NOT NULL),
                    '[]'
                ) AS genres
            FROM audio a
            LEFT JOIN audio_genres ag
                ON ag.audio_id = a.id
            LEFT JOIN genres g
                ON g.id = ag.genre_id
            WHERE a.status = 'available'
            GROUP BY a.id
            ORDER BY a.id;
        `);

        return res.status(200).json(audios);

    } catch (err) {
        next(err)
        console.error('Failed to retrieve audio data: ', err);
    }
});




audio.get('/single/:id', requireAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: 'Audio ID is required'
            });
        };

        const selectedTrack = await db.one(`
            SELECT * FROM audio WHERE id = $1;
        `, [ id ]);

        return res.json(selectedTrack);
    } catch (err) {
        console.error('Failed to fetch selected track: ', err);
        next();
    }
});


audio.get('/single/list/available', requireAdmin, async(req, res, next) => {
    try {
        const result = await db.any(`
            SELECT 
                a.id AS audio_id,
                a.audio_tagged_url,
                a.duration,  
                
                al.id AS album_id,
                al.cover_art_url,
                al.title,
                al.cover_art_url,

                aa.track_number
                
            FROM album_audio aa
            JOIN audio a ON a.id = aa.audio_id
            JOIN album al ON al.id = aa.album_id
            WHERE al.status = 'available';
        `);

        return res.json(result);
    } catch (err) {
        console.error('Failed retrieve single track: ', err);
        next(err);
    }
});


audio.get('/beat_tape/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const track = await db.one(`
            SELECT * FROM audio WHERE id = $1;
        `, [id]);

        console.log('Selected: ', track.id);
        return res.json({
            ...track,
            track_id: track.id
        })

    } catch(err) {
        console.log('Error on this motherfucking bitch: ', err);
    }
});





export default audio;