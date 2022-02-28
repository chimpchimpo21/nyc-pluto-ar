const express = require('express');
const path = require('path');
const cors = require('cors');
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
    .use(cors())
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.static('public'))
    .get('/db', async (req, res) => {
        let long = req.query.long;
        let lat = req.query.lat;
        var values = [long, lat];
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT address, ST_X(ST_Transform(geom_sm, 4326)), ST_Y(ST_Transform(geom_sm, 4326)) FROM centroids_wgs84_pluto_local WHERE ST_Intersects(ST_Buffer(ST_Transform(ST_SetSRID(ST_Point(${long}, ${lat}), 4326), 3857), 50), geom_sm);`);
            const results = { 'results': (result) ? result.rows : null};
            // res.render('pages/db', results);
            res.send(result.rows);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .listen(PORT, () => console.log(`listening on ${ PORT }`));