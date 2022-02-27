const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000;

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/local_centroids',
    // ssl: process.env.DATABASE_URL ? true : false
    ssl: { rejectUnauthorized: false }
});

// const pool = (() => {

// })

express()
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/db', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM centroids_wgs84_pluto_local');
            const results = { 'results': (result) ? result.rows : null};
            res.render('pages/db', results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .listen(PORT, () => console.log(`listening on ${ PORT }`));