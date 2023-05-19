const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: process.env.MESSAGE });
});

app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then(db => {
        res.status(201).json({ message: `Added a new movie: ${req.body.title}, the ID is: ${req.body._id}.` });
    }).catch(err => {
        res.status(404).json({ message: err });
    })
});

app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then(d => {
        res.status(200).json(d);
    }).catch(err => {
        res.status(500).json({ message: err.message });
    });
});

app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then(db => {
        res.status(200).json(db);
    }).catch(err => {
        res.status(404).json({ message: `No value found. ${err.message}` });
    })
});

app.put("/api/movies/:id", (req, res) => {
    db.updateMovieById(req.body, req.params.id).then(db => {
        res.json({ message: `The movie with ID ${req.params.id} is updated successfully.` });
    }).catch(err => {
        res.status(404).json({ message: err });
    })
})

app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(200).json({ message: `The movie with ID ${req.params.id} is deleted.` });
    }).catch(
        err => {
            res.status(404).json({ message: err });
        })
})


// "Initializing" the Module before the server starts
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});