import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleRank } from './controllers/rank.js';
import { handleClarifaiApiCall } from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
        // for dev
        // host: '127.0.0.1',
        // user: 'postgres',
        // password: '',
        // database: 'face-recognition'
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }    
});

const app = express();

app.use(express.json());
app.use(cors());

// root
app.get('/', (req, res) => {
    res.send('this is working');
})

// signin
app.post('/signin', (req, res) => {
    handleSignin(req, res, db, bcrypt)
})

// register
app.post('/register', (req, res) => {
    handleRegister(req, res, db, bcrypt)
})

// get a user profile
app.get('/profile/:id', (req, res) => {
    handleProfileGet(req, res, db)
})

// update user rank
app.put('/rank', (req, res) => {
    handleRank(req, res, db)
})

// submit image url
app.post('/image', (req, res) => {
    handleClarifaiApiCall(req, res)
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})
