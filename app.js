const express = require('express');
const cors = require('cors');
const blogRoute = require('./routes/Blog');

process.env.NODE_ENV === 'production' ? null : require('dotenv').config({path: './.env'});
require('./db/mongoose')

const app = express();
const port = process.env.PORT || 4000;

// parses request to json
app.use(express.json());
app.use(cors());

// routes
app.use(blogRoute);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})