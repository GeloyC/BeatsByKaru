import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors'

import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './data/database.js';
import { sessionStore } from './data/database.js';

// Routes
import user from './routes/user.js';
import genre from './routes/genre.js';

dotenv.config();



const app = express();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'Files/GenreCover')));


const PORT = 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // frontend
    credentials: true
}));

app.use(session({
    name: 'karubeats_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave:false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // change to true in production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// Initializing the routes
app.use('/user', user);
app.use('/genre', genre);

app.get('/', (req, res) => {
    res.send("Expressing....");
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    testConnection();
});