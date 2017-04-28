var fs = require('fs');
var Supplier = require('../models/suppliers');

module.exports = function(router, Supplier, serverlog){

router.route('/suppliers')
    .post((req, res) => {
        var supplier = new Supplier();

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
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                fs.appendFile(serverlog, `Supplier ${supplier.name} created!\n`);
                res.send({message: `Supplier ${supplier.name} created!`});
            }
        });
    })

    .get((req, res) => {
        Supplier.find((err, suppliers) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.json(suppliers);
                fs.appendFile(serverlog,`List of suppliers: ${supplier}\n`)
            }
        });
    });

router.route('/suppliers/:supplier_id')
    .get((req, res) => {
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                fs.appendFile(serverlog,`${supplier}\n`);
                res.json(supplier);
            }
        });
    })

    .put((req, res) => {
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
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
                        fs.appendFile(serverlog, `${err}\n`);
                    } else {
                        fs.appendFile(serverlog, `Supplier ${supplier.name} updated!\n`);
                        res.send({message: `Supplier ${supplier.name} updated!`});
                    }
                });
            }
        });
    })

    .delete((req, res) => {
        Supplier.remove({
            _id: req.params.supplier_id
        }, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.json({message: 'Successfully deleted!'});
                fs.appendFile(serverlog,`Supplier successfully deleted!`);
            }
        });
    });

};