/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 * 
 *  Name: Qing Zhang     Student ID: 130982218     Date: 19-May-2023
 *  Cyclic Link: https://periwinkle-hare-boot.cyclic.app
 *
 ********************************************************************************/


const express = require("express");
const cors = require("cors");
const env = require("dotenv").config();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({ message: "API Listening..." });
})

app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
        .then(theNewMovie => {
            res.status(201).json(theNewMovie);
        })
        .catch(error => {
            res.status(500).json({ message: `${error}` });
        });
})

// Use this to test: http://localhost:8080/api/movies?page=1&perPage=5&title=The%20Avengers
app.get('/api/movies', (req, res) => {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let title = req.query.title;

    db.getAllMovies(page, perPage, title)
        .then((theMovie) => {
            res.json(theMovie);
        })
        .catch((error) => {
            res.json({ message: `${error}` });
        })
})

// Use this ID to test: 573a1390f29313caabcd42e8
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
        .then(theMovie => {
            res.json(theMovie);
        })
        .catch(error => {
            res.status(500).json({ message: `${error}` });
        })
});

app.put('/api/movies/:id', (req, res) => {
    if (req.params.id == req.body._id) {
        db.updateMovieById(req.body, req.body._id)
            .then(theMovie => {
                res.json({ message: `The movie with ID ${theMovie._id} is updated.` })
            })
            .catch(error => {
                res.status(404).json({ message: "Not able to find the record." });
            });
    } else {
        res.status(500).json({ message: "Server error." });
    }
});

app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
        .then(theResult => {
            if (theResult.deletedCount === 1) {
                res.status(204).json({ message: `The movie is deleted.` });
            } else {
                res.status(404).json({ message: "Not able to find the record." })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Server error." });
        });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});