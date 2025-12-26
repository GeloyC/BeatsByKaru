import express from 'express';
import multer from 'multer';
import { pool } from '../data/database.js';
import { requireAdmin } from './user.js';
import fs from 'fs/promises'
import path from 'path';



const genre = express.Router();


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



genre.post('/new', requireAdmin, upload.single('cover_art'), async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return;

        const cover_art_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const [row] = await pool.query(
            'INSERT INTO genres (name, cover_art_url) VALUES (?, ?)',
            [ name, cover_art_url ]
        );

        return res.send({
            id: row.insertId,
            name: name,
            cover_art_url,
            message: 'Genre created successfully!'
        });

    } catch(err) {
        console.error('Error genre creation: ', err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
});


genre.get('/all', async (req, res) => {
    try {
        const [row] = await pool.query(
            'SELECT * FROM genres'
        );

        return res.status(200).json(row)

    } catch(err) {
        console.error('Error fetching genres data: ', err);
    }
});


const uploads_dir = path.join(process.cwd(), 'Files/GenreCover');

genre.delete('/remove/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [row] = await pool.query(
            'SELECT cover_art_url FROM genres WHERE id = ?',
            [id]
        );

        const image_url = row[0].cover_art_url;

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

        await pool.query('DELETE FROM genres WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Genre id ' + id + ' has been successfully deleted!',
        })

    } catch(err) {
        console.error('Failed to delete genre: ', err);
    }
});


genre.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [row] = await pool.query(
            'SELECT * FROM genres WHERE id = ?',
            [id]
        );

        return res.status(200).json(row[0]);
    } catch(err) {
        console.log('Failed to retrieve data: ');
    }
});


genre.patch('/:id/new', requireAdmin, upload.single('newImage'), async (req, res) => {
    try {
        const { id } = req.params;
        const {name} = req.body;

        const [prev] = await pool.query(
            'SELECT * FROM genres WHERE id = ?', [id]
        );

        const prev_name = prev[0].name;
        const prev_image = prev[0].cover_art_url;

        console.log(prev_image);

        if (name === prev_name) {
            return res.status(409).send('Duplicate record for name.');
        }


        const cover_art_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        if (cover_art_url) {
            if (prev_image) {
                const image_filename = path.basename(prev_image);
                const image_filepath = path.join(uploads_dir, image_filename);

                try {
                    fs.unlink(image_filepath);
                    console.log('Replaced image: ', image_filepath);
                } catch(err) {
                    console.error('Failed to delete image: ', err);
                }
            }
        }

        await pool.query(
            'UPDATE genres SET name = ?, cover_art_url = ? WHERE id = ?',
            [name, cover_art_url, id]
        );

        return res.status(200).send({
            success: true,
            genre: name,
            image: cover_art_url,
            message: 'Genre updated!',
        })

    } catch (err) {
        console.error('Failed to update genre: ', err);
    }
});

export default genre;