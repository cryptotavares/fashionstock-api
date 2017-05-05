var supplierRoutes = require('./supplier_routes');
var materialRoutes = require('./material_routes');
var productRoutes = require('./product_routes');
var authenticateRoutes = require('./authenticate_routes');
var userRoutes = require('./user_routes');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var config = require('../../constants');

module.exports = function(router, serverlog){
    authenticateRoutes(router, serverlog);

    router.use((req, res, next) => {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, config.jwtsecret, (err, decoded) => {
                if(err){
                    res.send({success: false, message: 'Failed to authenticate token!'});
                    fs.appendFile(serverlog, {success: false, message: 'Failed to authenticate token!'});
                    return;
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).json({
                success: false,
                message: 'No token provided!'
            });
        }
    });

    userRoutes(router, serverlog);
    supplierRoutes(router, serverlog);
    materialRoutes(router, serverlog);
    productRoutes(router, serverlog);
};