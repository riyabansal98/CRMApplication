const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const express = require('express')
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
    console.log("error while connecting to db");
});
db.once("open", () => {
    console.log("connected to MongoDB");
    
});

require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)
require('./routes/ticket.routes')(app)

module.exports = app.listen(serverConfig.PORT, () => {
    console.log(`Application started on port num: ${serverConfig.PORT}`)
})