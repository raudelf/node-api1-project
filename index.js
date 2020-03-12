const express = require('express');
const db = require('./data/db');

const server = express();

server.listen(4000, () => {
    console.log('Listening on port 4000');
});

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Testing')
});

// POST
server.post('/api/users', (req, res) => {
    const apiInfo = req.body;
    console.log('User: ', apiInfo);

    db.insert(apiInfo)
        .then(data => {
            res.status(201).json({data})
        })
        .catch(err => {
            res.status(500).json({errorMessage: 'There was an error while saving the user to the database'});
            if(err.name === null || err.bio === null) {
                res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
            }
        });
});

// GET
server.get('/api/users', (req, res) => {
    db.find()
        .then(data => {
            res.status(200).json({data});
        })
        .catch(err => {
            res.status(500).json({errorMessage: 'The users information could not be retrieved.', err});
        });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    console.log('USER ID: ', id)

    db.findById(id)
        .then(data => {
            if (data) {
                console.log('DATA: ', data)
                res.status(200).json({data})
            } else {
                res.status(404).json({message: 'The user with the specified ID does not exist.'})
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: 'The user information could not be retrieved.', err})
        })
})

// DELETE

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    console.log('ID: ', user)
    db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(200).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be removed", err })
        })
})

// PUT

server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    
    db.update(id, changes)
        .then(updated => {
            if (updated) {
                res.status(200).json({updated});
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            };
            if (updated.name === null || updated.bio === null) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." })}
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        })
})