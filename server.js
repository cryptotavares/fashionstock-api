
// BASE SETUP
/* ############################################################################### */
var fs = require('fs');
var express = require('express');
var app = express();

var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./constants');

var serverlog = 'server.log';

//connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//var Supplier = require('./app/models/suppliers');

var port = process.env.PORT || 8080;

// ROUTES for API
/* ############################################################################### */
var router = express.Router();

router.use((req, res, next) => {
    var now = new Date().toDateString();
    var logReq = `${now}: Request ${req.method} ${req.url}\n`;

    console.log(logReq);
    fs.appendFile(serverlog, logReq);
    next();
});

require('./app/routes')(router, serverlog);


// REGISTER ROUTES - All routes will prefixed with API
/* ############################################################################### */
app.use('/api', router);

// START THE SERVER
/* ############################################################################### */
app.listen(port);
console.log('Server started on port:', port);

module.exports = app; //for testing purpose