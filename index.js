const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());


express()
    // .get('/', (req, res) => {
    //     console.log(req.query);
    //     return res.send("hello, world!");
    // })
    .get('/', (req, res) => res.render('find-centroids.html'))
    .listen(PORT, () => console.log(`listening on ${ PORT }`));