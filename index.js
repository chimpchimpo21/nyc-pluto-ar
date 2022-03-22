const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000;
const app = express();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/thesis',
    // ssl: process.env.DATABASE_URL ? true : false
    ssl: { rejectUnauthorized: false }
});

app.use(cors())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    })
app.get('/db', async (req, res) => {
        let long = req.query.long;
        let lat = req.query.lat;
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT *, ST_X(wkb_geometry), ST_Y(wkb_geometry) FROM nyc_pluto_final WHERE ST_Intersects(ST_Buffer(ST_Transform(ST_SetSRID(ST_Point(${long}, ${lat}), 4326), 3857), 50), wkb_geometry);`);
            // const results = { 'results': (result) ? result.rows : null};
            // res.render('pages/db', results);
            res.send(result.rows);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
})
app.listen(PORT, () => console.log(`listening on ${ PORT }`));