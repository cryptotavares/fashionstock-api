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
    supplier.user_id = req.decoded._doc._id;
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
            res.status(500).json({
                success: false,
                error: err
            });
            fs.appendFile(serverlog, `${err}\n`);
        } else {
            fs.appendFile(serverlog, messageLog);
            res.status(200).json({
                success: true,
                message: messageLog
            });
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
        Supplier.find().where('user_id').in(req.decoded._doc._id).exec((err, suppliers) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.status(200).json({
                    success: true,
                    results: suppliers
                });
                fs.appendFile(serverlog,`List of suppliers: ${suppliers}\n`);
            }
        });
    });

router.route('/suppliers/:supplier_id')
    .get((req, res) => {
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                if(!supplier){
                    res.status(404).json({
                        success: false,
                        message: 'Supplier not found.'
                    });
                    fs.appendFile(serverlog,`${supplier}\n`);
                    return;
                }
                fs.appendFile(serverlog,`${supplier}\n`);
                res.status(200).json({
                    success: true,
                    results: supplier
                });
            }
        });
    })

    .put((req, res) => {
        var iscreate = false;
        Supplier.findById(req.params.supplier_id, (err, supplier) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                if(!supplier){
                    res.status(404).json({
                        success: false,
                        message: 'Supplier not found.'
                    });
                    fs.appendFile(serverlog,`${supplier}\n`);
                    return;
                }
                createSupplier(req, res, supplier, iscreate);
            }
        });
    })

    .delete((req, res) => {
        Supplier.remove({
            _id: req.params.supplier_id
        }, (err, supplier) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Successfully deleted!'
                });
                fs.appendFile(serverlog,`Supplier successfully deleted!`);
            }
        });
    });

};