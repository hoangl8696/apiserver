const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/demoAPI');

const app = express();

app.use(bodyParser.json());


const port = process.env.PORT || 3000;
app.listen(port);