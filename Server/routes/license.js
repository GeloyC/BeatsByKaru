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


license.post('/add', requireAdmin, upload.single('license_file'), async (req, res, next) => {
    try {
        const { license } = req.body;
        if (!license) return;

        const document_url = `${req.protocol}://${req.get('host')}/documents/${req.file.filename}`;

        const result = await db.one(
            'INSERT INTO license (license, document_url) VALUES ($1, $2) RETURNING id, license, document_url',
            [license, document_url]
        );

        return res.send({
            id: result.id,
            license,
            document_url,
            message: 'License uploaded!'
        })

    } catch(err) {
        console.error('Failed to create license: ', err);
        res.status(500).json({ message: 'Server error: ', err })
        next(err);
    }
});


license.get('/', async (req, res, next) => {
    try {
        const result = await db.any(
            `SELECT     
                id, license,
                TO_CHAR(date_created, 'FMMonth DD, YYYY') AS date_created,
                document_url
            FROM license`
        );

        return res.send(result);
    } catch (err) {
        console.error('Failed to retreive licenses: ', err);
        next(err);
    }
});


const license_dir = path.join(process.cwd(), 'Files/License');

license.delete('/remove/:id', requireAdmin, async (req, res, next) => {

    try {
        const { id } = req.params;

        // get the data of the license that is going to be deleted
        const license_to_delete =  await db.one(
            'SELECT document_url FROM license WHERE id = $1', [id]
        );

        const document = license_to_delete.document_url;
        console.log('Document: ', document);

        if (document) {
            const filename = path.basename(document);
            const file_path = path.join(license_dir, filename);

            try {
                await fs.unlink(file_path);
                console.log('Deleted: ', file_path);
            } catch (err) {
                console.err('Failed to delete: ', err);
            }
        };

        await db.none(
            'DELETE FROM license WHERE id = $1', [id]
        );

        return res.status(200).send({message: 'Delete successfull!'});

    } catch (err) {
        console.error('Failed to delete license id: ', err);
        next(err);
    }
});


license.patch('/edit/:id', requireAdmin, upload.single('new_license_doc') ,async (req, res, next) => {
    try {
        const { id } = req.params;
        const { license_name } = req.body;

        const prev_license  = await db.one(
            'SELECT * FROM genres WHERE id = $1', [id]
        );

        const prev_name = prev_license.license;
        console.log('Name of previous license: ', prev_name);

        if (license_name & license_name === prev_name) {
            return res.status(409).send('Duplicate, please change to another name!');
        }

        let license_url = prev_license.document_url;

        // if (req.file)

    } catch(err) {
        console.error('Failed to update license: ', err);
        next(err);
    }

});


export default license;