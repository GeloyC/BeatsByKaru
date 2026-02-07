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


audio.post('/upload-single', requireAdmin, 
    upload.fields([
        {name: 'untagged', maxCount: 1},
        {name: 'tagged', maxCount: 1}
        // {name: 'cover_art', maxCount: 1}
    ]), async (req, res, next) => {

    try {
        const { title, duration, audio_key, bpm, genre_id } = req.body;

        const audio_url_filename = req.files.untagged[0].filename;
        const audio_tagged_filename = req.files.tagged[0].filename;
        // const cover_art_filename = req.files.cover_art[0].filename;


        const audio_url = `${req.protocol}://${req.get("host")}/audio-uploads/${audio_url_filename}`; 
        const audio_tagged_url = `${req.protocol}://${req.get("host")}/audio-uploads/${audio_tagged_filename}`; 
        // const cover_art_url = `${req.protocol}://${req.get("host")}/audio-uploads/${cover_art_filename}`;


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


audio.patch('/single/:id/release', requireAdmin, upload.fields([{name: 'cover_art', maxCount: 1}]),  async (req, res, next) => {
    try {
        const { id } = req.params;
        const { license_id, price, date_updated } = req.body;

        const cover_art_url = `${req.protocol}://${req.get("host")}/audio-uploads/${req.files.cover_art[0].filename}`;

        const release = await db.any(`
            UPDATE audio SET 
                license_id = $1, cover_art_url = $2,  price = $3, date_updated = $4, status = 'available'
            WHERE id = $5
            RETURNING id, price, date_updated
        `, [ license_id, cover_art_url, price, date_updated, id ]);

        return res.status(200).json({
            sucess: true,
            message: `Track with id ${id} updated successfully!`,
            date: {...release}
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


audio.get('/all', async (req, res, next) => {
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


export default audio;