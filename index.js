const express = require('express');
const { Pool, Client } = require('pg');
// const connectionString = 'postgres://ncxtnyffvzymth:95e455939a032eed3410b2fd00c303114b662b257374443010e8e7627b4c37f1@ec2-18-235-4-83.compute-1.amazonaws.com:5432/dd48po6c8ohfo4'
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());


app
    // .get('/', (req, res) => {
    //     console.log(req.query);
    //     return res.send("hello, world!");
    // })
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/find-centroids.html'));
    })
    .get('/my-location.js', (req, res) => {
        res.sendFile(path.join(__dirname + '/my-location.js'));
    })
    .get('/api', (req, res) => {
        let long = req.query.long;
        let lat = req.query.lat;
        var values = [long, lat];
        //console.log(req.query);
        const text = 'SELECT address, ST_X(ST_Transform(geom_sm, 4326)), ST_Y(ST_Transform(geom_sm, 4326)) FROM nyc_pluto_centroids WHERE ST_Intersects(ST_Buffer(ST_Transform(ST_SetSRID(ST_Point($1, $2), 4326), 3857), 50), geom_sm);';
        // const { Client } = require('pg');
        const { rows } = require('pg/lib/defaults');

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        client.connect();

        client.query(text, values, (err, result) => {
            if(!err) {
                // for (var i = 0; i < result.rows.length; i++) {
                //     let long = result.rows[i].st_x
                //     let lat = result.rows[i].st_y
                //     res.send(`longitude: ${long} ; latitude: ${lat}`);
                // }
                // console.log(res.rows);
                console.log("request made");
                res.send(result.rows);
        
            }
            else {
                console.log(err.message);
            }
            client.end;
        });
    })
    .listen(PORT, () => console.log(`listening on ${ PORT }`));