require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;
const NYT_API_KEY = process.env.NYT_API_KEY;
console.log(NYT_API_KEY);

app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.get('/', (req, res) => {
    // res.send('hello backend')
    axios.get(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=godfather&api-key=${NYT_API_KEY}`)
    .then(response => {
        if (response.status === 200)
        console.log(response.data.results);
    })
    .catch(err => {
        console.log(err);
    })
});

app.listen(PORT, () => {
    console.log(`server is live on PORT: ${PORT}`);
})
