import express from 'express';
import multer from 'multer';
import { db } from '../data/database.js';
import { requireAdmin } from './user.js';
import fs from 'fs/promises'
import path from 'path';

const license = express.Router();

// Multer setup asdasd
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Files/License');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${extension}`);
    }
});

const upload = multer({ storage })


license.post('/add', requireAdmin, upload.single('license_file'), async (req, res) => {
    try {
        const { license } = req.body;
        if (!license) return;

        const document_url = `${req.protocol}://${req.get('host')}/documents/${req.file.filename}`;

        const [row] = await db.query(
            'INSERT INTO license (license, document_url) VALUES (?, ?)',
            [license, document_url]
        );

        return res.send({
            id: row.insertId,
            license,
            document_url,
            message: 'License uploaded!'
        })

    } catch(err) {
        console.error('Failed to create license: ', err);
        res.status(500).json({ message: 'Server error: ', err })
    }
});


license.get('/', async (req, res) => {
    try {
        const [row] = await db.query(
            `SELECT     
                id, license,
                DATE_FORMAT(date_created, '%M %d, %Y') AS date_created,
                document_url
            FROM license`
        );

        return res.send(row);
    } catch (err) {
        console.error('Failed to retreive licenses: ', err);
    }
});

export default license;