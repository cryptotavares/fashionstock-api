var fs = require('fs');
var Material = require('../models/material');
var Supplier = require('../models/suppliers');

module.exports = function(router, serverlog){

router.route('/materials')
    .post((req, res) => {
        var material = new Material();

        Supplier.findById(req.body.supplier_id, (err, supplier) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                material.name = req.body.name;
                material.supplier_id = req.body.supplier_id;
                material.cost = req.body.cost;
                material.reference = req.body.reference;
                material.stock = req.body.stock;
                material.stock_unit = req.body.stock_unit;
                material.details = req.body.details;
                material.created_on = new Date();
                material.lastUpdate = material.created_on;

                material.save((err) => {
                    if(err){
                        res.send(err);
                        fs.appendFile(serverlog, `${err}\n`);
                    } else {
                        fs.appendFile(serverlog, `Material ${material.name} created!\n`);
                        res.send({message: `Material ${material.name} created!`});
                    }
                });
            }
        });
    })

    .get((req, res) => {
        Material.find((err, materials) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.json(materials);
                fs.appendFile(serverlog,`List of materials: ${materials}\n`);
            }
        });
    });

router.route('/materials/:material_id')
    .get((req, res) => {
        Material.findById(req.params.material_id, (err, material) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                fs.appendFile(serverlog,`${material}\n`);
                res.json(material);
            }
        });
    })

    .put((req, res) => {
        Material.findById(req.params.material_id, (err, material) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {

                if(material.supplier_id != req.body.supplier_id){
                    Supplier.findById(req.body.supplier_id, (err, supplier) => {
                        if(err){
                            res.send(err);
                            fs.appendFile(serverlog, err);
                            return;
                        }
                        material.name = req.body.name;
                        material.supplier_id = req.body.supplier_id;
                        material.cost = req.body.cost;
                        material.reference = req.body.reference;
                        material.stock = req.body.stock;
                        material.stock_unit = req.body.stock_unit;
                        material.details = req.body.details;
                        material.lastUpdate = new Date();

                        material.save((err) => {
                            if(err){
                                res.send(err);
                                fs.appendFile(serverlog, `${err}\n`);
                            } else {
                                fs.appendFile(serverlog, `Material ${material.name} updated!\n`);
                                res.send({message: `Material ${material.name} updated!`});
                            }
                        });

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
                material.lastUpdate = new Date();

                material.save((err) => {
                    if(err){
                        res.send(err);
                        fs.appendFile(serverlog, `${err}\n`);
                    } else {
                        fs.appendFile(serverlog, `Material ${material.name} updated!\n`);
                        res.send({message: `Material ${material.name} updated!`});
                    }
                });
            }
        });
    })

    .delete((req, res) => {
        Material.remove({
            _id: req.params.material_id
        }, (err, material) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.json({message: 'Successfully deleted!'});
                fs.appendFile(serverlog,`Material successfully deleted!`);
            }
        });
    });

};