import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleRank } from './controllers/rank.js';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '',
        database: 'face-recognition'
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

app.listen(3000, () => {
    console.log('app is running on port 3000');
})
