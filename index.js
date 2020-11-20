require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;
const NYT_API_KEY = process.env.NYT_API_KEY;

const db = require('./models')

app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.get('/', (req, res) => {
    // res.send('hello backend')
    axios.get(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=godfather&api-key=${NYT_API_KEY}`)
    .then(response => {
        if (response.status === 200) {
            // display title, byline, publication date, url, headline
            let len = response.data.results.length;
            for (let i = 0; i < len; i++) {
                let movieResultObject = response.data.results[i];

                const finalObject = {
                    title: movieResultObject.display_title,
                    byline: movieResultObject.byline,
                    headline: movieResultObject.headline,
                    date: movieResultObject.publication_date,
                    url: movieResultObject.link.url
                }
                // adding each movie to database inside of (movies)
                db.movie.findOrCreate({
                    where: { title: finalObject.title },
                    defaults: {
                        byline: finalObject.byline,
                        headline: finalObject.headline,
                        date: finalObject.date,
                        url: finalObject.url,
                    }
                }).then(([movie, created]) => {
                    // res.send(movie.get().title)
                    console.log(created);
                })
            }
        }
        // console.log(response.data.results);
    })
    .catch(err => {
        console.log(err);
    })
});


app.get('/getrocky', (req, res) => {
    axios.get(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=rocky&api-key=${NYT_API_KEY}`)
    .then(response => {
        if (response.status === 200) {
            // display title, byline, publication date, url, headline
            let len = response.data.results.length;
            for (let i = 0; i < len; i++) {
                let movieResultObject = response.data.results[i];

                const finalObject = {
                    title: movieResultObject.display_title,
                    byline: movieResultObject.byline,
                    headline: movieResultObject.headline,
                    date: movieResultObject.publication_date,
                    url: movieResultObject.link.url
                }
                // adding each movie to database inside of (movies)
                db.movie.findOrCreate({
                    where: { title: finalObject.title },
                    defaults: {
                        byline: finalObject.byline,
                        headline: finalObject.headline,
                        date: finalObject.date,
                        url: finalObject.url,
                    }
                }).then(([movie, created]) => {
                    // res.send(movie.get().title)
                    console.log(created);
                })
            }
        }
        // console.log(response.data.results);
    })
    .catch(err => {
        console.log(err);
    })
})

// godfather route
app.get('/godfather', (req, res) => {
    db.movie.findAll().then(moviesArray => {
        console.log(moviesArray);
    })
})

// rocky route
app.get('/rocky', (req, res) => {
    db.movie.findOne({
        where: { title: 'Rocky II' }
    }).then(rockyMovie => {
        res.send(rockyMovie)
    })
})


app.listen(PORT, () => {
    console.log(`server is live on PORT: ${PORT}`);
})
