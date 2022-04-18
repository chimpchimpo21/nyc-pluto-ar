const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000;
const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/thesis',
    ssl: { rejectUnauthorized: false }
});

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    })
app.get('/db', async (req, res) => {
        let long = req.query.long;
        let lat = req.query.lat;
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT *, ST_X(ST_Centroid(geometry)), ST_Y(ST_Centroid(geometry)), ST_AsGeoJSON(ST_Transform(geometry, 4326)) as geojson FROM nyc_pluto_final2 WHERE ST_Intersects(ST_Buffer(ST_Transform(ST_SetSRID(ST_Point(${long}, ${lat}), 4326), 2263), 75), geometry);`);
            res.send(result.rows);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
})
app.listen(PORT, () => console.log(`listening on ${ PORT }`)); 