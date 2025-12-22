import express from 'express';
import multer from 'multer';
import { pool } from '../data/database.js';

const genre = express.Router();
genre.use("/uploads", express.static("./Files/GenreCover"));


// Multer setup asdasd
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Files/GenreCover/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() + 1e9);
        const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${extension}`);
    }
});

const upload = multer({ storage })



genre.post('/new', upload.single('cover_art'), async (req, res) => {
    try {
        const { name } = req.body;

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


export default genre;