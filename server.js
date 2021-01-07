import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Kgt!Q4S#PdD#YR@WS*q8L',
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
    const { email, password } = req.body;

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                            .where('email', '=', email)
                            .then(user => {
                                res.json(user[0])
                            })
                            .catch(error => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }            
        })
        .catch(error => res.status(400).json('wrong credentials'))
})

// register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })    
    .catch(error => res.status(400).json('unable to register'))
})

// get a user profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db.select('*').from('users')
        .where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0]);    
            } else {
                res.status(400).json('user not found')
            }          
        })
        .catch(error => res.status(400).json('error getting user'))    
})

// update user rank
app.put('/rank', (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('rank', 1)
        .returning('rank')
        .then(rank => {
            res.json(rank[0])
        })
        .catch(error => res.status(400).json('unable to get rank'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})
