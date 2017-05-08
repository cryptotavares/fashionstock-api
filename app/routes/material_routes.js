var fs = require('fs');
var Material = require('../models/material');
var Supplier = require('../models/suppliers');

module.exports = function(router, serverlog){

var createMaterial = function(req, res, material, iscreate){
    var messageLog = '';
    Supplier.findById(req.body.supplier_id, (err, supplier) => {
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
                return;
            }

            material.name = req.body.name;
            material.supplier_id = req.body.supplier_id;
            material.cost = req.body.cost;
            material.reference = req.body.reference;
            material.stock = req.body.stock;
            material.stock_unit = req.body.stock_unit;
            material.details = req.body.details;
            if(iscreate){
                messageLog =`Material ${material.name} created!\n`;
                material.created_on = new Date();
                material.lastUpdate = material.created_on;
            } else {
                messageLog = `Material ${material.name} updated!`;
                material.lastUpdate = new Date();
            }
            material.save((err) => {
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
        }
    });
};

router.route('/materials')
    .post((req, res) => {
        var material = new Material();
        var iscreate = true;
        createMaterial(req, res, material, iscreate);
    })

    .get((req, res) => {
        Material.find((err, materials) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.status(200).json({
                    success: true,
                    results: materials
                });
                fs.appendFile(serverlog,`List of materials: ${materials}\n`);
            }
        });
    });

router.route('/materials/:material_id')
    .get((req, res) => {
        Material.findById(req.params.material_id, (err, material) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                if(!material){
                    res.status(404).json({
                        success: false,
                        message: 'Material not found.'
                    });
                    fs.appendFile(serverlog,`${material}\n`);
                    return;
                }
                fs.appendFile(serverlog,`${material}\n`);
                res.status(200).json({
                    success: true,
                    results: material
                });
            }
        });
    })

    .put((req, res) => {
        var iscreate = false;
        Material.findById(req.params.material_id, (err, material) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                if(!material){
                    res.status(404).json({
                        success: false,
                        message: 'Material not found.'
                    });
                    fs.appendFile(serverlog,`${material}\n`);
                    return;
                }
                createMaterial(req, res, material, iscreate);
            }
        });
    })

    .delete((req, res) => {
        Material.remove({
            _id: req.params.material_id
        }, (err, material) => {
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
                fs.appendFile(serverlog,`Material successfully deleted!`);
            }
        });
    });

};