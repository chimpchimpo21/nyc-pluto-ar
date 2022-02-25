const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());

const pool = new Pool();

app.get('/location', (req, res) => {
    res.send('Hello, world!');
});