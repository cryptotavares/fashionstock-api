var fs = require('fs');
var Supplier = require('../models/suppliers');

module.exports = function(router, serverlog){

var createSupplier = function(req, res, supplier, iscreate){
    var messageLog = '';
    supplier.name = req.body.name;
    supplier.email = req.body.email;
    supplier.telephone = req.body.telephone;
    supplier.address = req.body.address;
    supplier.city = req.body.city;
    supplier.country = req.body.country;
    if(iscreate){
        supplier.active = true;
        messageLog = `Supplier ${supplier.name} created!\n`;
        supplier.created_on = new Date();
        supplier.lastUpdate = supplier.created_on;
    } else {
        supplier.active = req.body.active;
        messageLog = `Supplier ${supplier.name} updated!\n`;
        supplier.lastUpdate = new Date();
    }
    supplier.save((err) => {
        if(err){
            res.send(err);
            fs.appendFile(serverlog, `${err}\n`);
        } else {
            fs.appendFile(serverlog, messageLog);
            res.send({message: messageLog});
        }
    });
};

router.route('/suppliers')
    .post((req, res) => {
        var supplier = new Supplier();
        var iscreate = true;
        createSupplier(req, res, supplier, iscreate);
    })

    .get((req, res) => {
        Supplier.find((err, suppliers) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.json(suppliers);
                fs.appendFile(serverlog,`List of suppliers: ${suppliers}\n`);
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
        var iscreate = false;
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                createSupplier(req, res, supplier, iscreate);
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