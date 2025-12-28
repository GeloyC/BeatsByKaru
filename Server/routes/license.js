import express from 'express';
import multer from 'multer';
import { pool } from '../data/database.js';
import { requireAdmin } from './user.js';
import fs from 'fs/promises'
import path from 'path';

const license = express.Router();

export default license;