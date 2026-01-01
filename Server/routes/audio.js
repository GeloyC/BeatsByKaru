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
        {name: 'tagged', maxCount: 1},
        {name: 'cover_art', maxCount: 1}
    ]), async (req, res, next) => {

    try {
        const { title, duration, audio_key, bpm, waveform, license_id } = req.body;
        const audio_url = `${req.protocol}://${req.get("host")}/audio-uploads/${req.files.untagged[0].filename}`; // url for untagged/clean audio version
        const audio_tagged_url = `${req.protocol}://${req.get("host")}/audio-uploads/${req.files.tagged[0].filename}`; // url with producer tag audio version
        const cover_art_url = `${req.protocol}://${req.get("host")}/audio-uploads/${req.files.cover_art[0].filename}`;

        if (!title || !duration || !audio_key || !bpm || !waveform || !license_id) {
            return res.status(400).send('Please complete all field before submitting!');
        }

        if (!req.files?.untagged || !req.files?.tagged || !req.files?.cover_art) {
            return res.status(400).send('Audio with tag/no tag and Cover art is required.');
        }

        // handling error
        const check_title = await db.one(
            'SELECT * FROM audio WHERE title = $1', [title]
        );

        if (title && title === check_title.title) {
            return res.status(409).send('Duplicate title, use a unique title for the track.');
        }


        const upload = await db.one(`
            INSERT INTO audio 
                (title, audio_url, cover_art_url, audio_tagged_url, duration, audio_key, bpm, waveform, license_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, title; 
            `,
            [ title,audio_url, cover_art_url, audio_tagged_url, duration, audio_key, bpm, waveform, license_id ]
        );


        return res.status(201).json({
            ...upload,
            message: 'Audio single uploaded sucessfully!'
        });

    } catch(err) {
        console.log('Error uploading audio: ', err);
        next(err);
    }
})




export default audio;