
// BASE SETUP
/* ############################################################################### */
var fs = require('fs');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var mongoIdentity = require('./constants.js');

var serverlog = 'server.log';

//connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(mongoIdentity.mongoURI);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var Supplier = require('./app/models/suppliers');

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

router.route('/suppliers')
    .post((req, res) => {
        var supplier = new Supplier();

        if(!req.body.name){
            var noname = {
                message: 'Supplier must have a name',
                result: false
            };
            res.json(noname);
            fs.appendFile(serverlog, 'Error: ' + JSON.stringify(noname));
        }

        Supplier.find( (err, lsuppliers) => {
            if(err)
                res.send(err);

            for (var i = 0; i < lsuppliers.length; i++) {
                var aux = lsuppliers[i];
                if(req.body.name == aux.name){
                    var existingSup = {
                        message: 'Supplier already exist! Supplier name must be unique!',
                        result: false
                    };
                    res.json(existingSup);
                    fs.appendFile(serverlog, 'Error: ' + JSON.stringify(existingSup));
                    return;
                }
            }
            supplier.name = req.body.name;
            supplier.email = req.body.email;
            supplier.telephone = req.body.telephone;
            supplier.address = req.body.address;
            supplier.city = req.body.city;
            supplier.country = req.body.country;
            supplier.created_on = new Date();
            supplier.lastUpdate = supplier.created_on;

            supplier.save((err) => {
                if(err){
                    res.send(err);
                    fs.appendFile(serverlog, err);
                }

                fs.appendFile(serverlog, `Supplier ${supplier.name} created!`);
                res.send({message: `Supplier ${supplier.name} created!`});

            });
        });
    })

    .get((req, res) => {
        Supplier.find((err, suppliers) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, err);
            }
            res.json(suppliers);
        });
    });

router.route('/suppliers/:supplier_id')
    .get((req, res) => {
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, err);
            }
            res.json(supplier);
        });
    })

    .put((req, res) => {
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, err);
            }
            
            supplier.name = req.body.name;
            supplier.email = req.body.email;
            supplier.telephone = req.body.telephone;
            supplier.address = req.body.address;
            supplier.city = req.body.city;
            supplier.country = req.body.country;
            supplier.lastUpdate = new Date();

            supplier.save((err) => {
                if(err){
                    res.send(err);
                    fs.appendFile(serverlog, err);
                }

                fs.appendFile(serverlog, `Supplier ${supplier.name} updated!`);
                res.send({message: `Supplier ${supplier.name} updated!`});

            });
        });
    })

    .delete((req, res) => {
        Supplier.remove({
            _id: req.params.supplier_id
        }, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, err);
            }
            res.json({message: 'Successfully deleted!'});
        })
    });

// REGISTER ROUTES - All routes will prefixed with API
/* ############################################################################### */
app.use('/api', router);

// START THE SERVER
/* ############################################################################### */
app.listen(port);
console.log('Server started on port:', port);
