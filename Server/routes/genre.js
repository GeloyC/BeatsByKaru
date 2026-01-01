import express from 'express';
import multer from 'multer';
import { db } from '../data/database.js';
import { requireAdmin } from './user.js';
import fs from 'fs/promises'
import path from 'path';
import { readdirSync } from 'fs';



const genre = express.Router();

// TODO
// Fix queries to align with postgres

// Multer setup asdasd
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Files/GenreCover');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${extension}`);
    }
});

const upload = multer({ storage })



genre.post('/new', requireAdmin, upload.single('cover_art'), async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        };

        if (!req.file) {
            return res.status(400).json({ message: 'Cover art is required' });
        }

        const cover_art_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const result = await db.one(
            'INSERT INTO genres (name, cover_art_url) VALUES ($1, $2) RETURNING id, name, cover_art_url',
            [ name, cover_art_url ]
        );


        return res.status(201).json({
            ...result,
            message: 'Genre created successfully!'
        });

    } catch(err) {
        console.error('Error genre creation: ', err);
        res.status(500).json({ message: `Server error: ${err}` });
        next(err);
    }
});


genre.get('/all', async (req, res, next) => {
    try {
        const result = await db.any(
            'SELECT * FROM genres'
        );

        return res.status(200).json(result)

    } catch(err) {
        console.error('Error fetching genres data: ', err);
        next(err);
    }
});


const uploads_dir = path.join(process.cwd(), 'Files/GenreCover');

genre.delete('/remove/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const image = await db.one(
            'SELECT cover_art_url FROM genres WHERE id = $1', [id]
        );

        const image_url = image.cover_art_url;

        if (image_url) {
            const filename = path.basename(image_url);
            const file_path = path.join(uploads_dir, filename);

            try {
                await fs.unlink(file_path);
                console.log('Deleted: ', file_path);
            } catch (err) {
                console.error('Failed to delete: ', err);
            }
        }

        await db.none('DELETE FROM genres WHERE id = $1', [id]);

        return res.status(200).json({
            message: 'Genre id ' + id + ' has been successfully deleted!',
        })

    } catch(err) {
        console.error('Failed to delete genre: ', err);
    }
});


genre.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await db.one(
            'SELECT * FROM genres WHERE id = $1',
            [id]
        );

        return res.status(200).json(result);
    } catch(err) {
        console.log('Failed to retrieve data: ');
        next(err);
    }
});


genre.patch('/:id/new', requireAdmin, upload.single('newImage'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const previous = await db.one(
            'SELECT * FROM genres WHERE id = $1', [id]
        );

        const prev_name = previous.name;
        const prev_image = previous.cover_art_url;

        if (name && name === prev_name) {
            return res.status(409).send('Duplicate record for name.');
        }

        let cover_art_url = prev_image;

        if (req.file) {
            cover_art_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            if (prev_image) {
                const image_filename = path.basename(prev_image);
                const image_filepath = path.join(uploads_dir, image_filename);

                try {
                    await fs.unlink(image_filepath);
                    console.log('Replaced image: ', image_filepath);
                } catch(err) {
                    console.error('Failed to delete image: ', err);
                }
            }
        }

        await db.one(
            'UPDATE genres SET name = $1, cover_art_url = $2 WHERE id = $3 RETURNING name, cover_art_url',
            [name || prev_name, cover_art_url, id]
        );

        return res.status(200).send({
            success: true,
            genre: name || prev_name,
            image: cover_art_url,
            message: 'Genre updated!',
        })

    } catch (err) {
        console.error('Failed to update genre: ', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

export default genre;