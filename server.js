import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password: 'cookies',
            email: 'john@gmail.com',
            rank: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            password: 'bananas',
            email: 'sally@gmail.com',
            rank: 0,
            joined: new Date()
        }
    ],
    // login: [
    //     {
    //         id: '987',
    //         hash: '',
    //         email: 'john@gmail.com'
    //     }
    // ]
}

app.use(express.json());
app.use(cors());

// root
app.get('/', (req, res) => {
    // res.send('this is working');
    res.send(database.users);
})

// signin
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
})

// register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, function(err, hash) {
        console.log(hash);
    });

    database.users.push(
        {
            id: '125',
            name: name,
            email: email,
            password: password,
            rank: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length - 1]);
})

// get a user profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })

    if (!found) {
        return res.status(404).json('user not found');   
    }    
})

// update user rank
app.put('/rank', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.rank++;
            return res.json(user.rank);
        }
    })

    if (!found) {
        return res.status(404).json('user not found');   
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})
