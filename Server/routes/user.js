import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../data/database.js';

const user = express.Router();

user.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [row] = await pool.execute(
            'SELECT id, username, password from admin WHERE username = ?',
            [username]
        );

        if (row.length === 0 ) {
            return res.status(401).json({ message: 'Incorrect login credentials!'});
        }

        const admin = row[0];
        const is_match = await bcrypt.compare(password, admin.password);

        if(!is_match) {
            return res.status(401).json({ message: 'Invalid login credentials!' });
        }

        req.session.admin = {
            id: admin.id,
            username: admin.username
        }

        res.json({ message:'Login successful!' })

    } catch (err) {
        console.error('Failed to login: ', err);
        return res.json({error: 'Failed to login: ', err});
    }
});

export const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.admin) {
        return res.status(401).json({ message: 'Unauthorized: No logged in user!' });
    }

    const { id, username } = req.session.admin;

    if (!id || !username) {
        return res.status(400).json({message: 'Invalid session data!'})
    }

    next();
}

user.get('/', (req, res) => {
    if(!req.session.admin) {
        return res.json({ user: null });
    }

    res.json({
        user: {
            id: req.session.admin.id,
            username: req.session.admin.username
        }
    });
});


user.post('/logout', requireAdmin, async (req, res) => {
    const sid = req.sessionID;

    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destoy session: ', err);
            return res.status(500).send('Failed to logout!')
        }

        res.clearCookie('karubeats_session');
        res.send(`Logged out session: ${sid}`);
    }) 
});




export default user;
