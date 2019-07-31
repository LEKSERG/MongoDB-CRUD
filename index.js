const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const api = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Database Connect
const dev_db_url = 'mongodb://localhost/TC-MongoHW';
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, {useNewUrlParser: true, useFindAndModify: false});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/', api);

app.use( (req, res, next) => { res.status(404).send("Sorry can't find that!") });

const port = 5000;
app.listen(port, () => console.log(`Server started succesfuly! On port ${port}!`));
