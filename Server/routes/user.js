import express from 'express';
import bcrypt from 'bcrypt';2
import { db } from '../data/database.js';

const user = express.Router();



// TODO:
// Insert admin credential on admin table in Postgres
// establish session connection too
// have fun / study hard

user.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.one(
            'SELECT id, username, password from admin WHERE username = $1',
            [username]
        );

        if (!result) {
            return res.status(401).json({ message: 'Incorrect login credentials!'});
        }

        // const admin = result.row[0];
        const is_match = await bcrypt.compare(password, result.password);

        if(!is_match) {
            return res.status(401).json({ message: 'Invalid login credentials!' });
        }

        req.session.admin = {
            id: result.id,
            username: result.username
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
