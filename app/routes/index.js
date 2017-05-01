var supplierRoutes = require('./supplier_routes');
var materialRoutes = require('./material_routes');
var productRoutes = require('./product_routes');

module.exports = function(router, serverlog){
    supplierRoutes(router, serverlog);
    materialRoutes(router, serverlog);
    productRoutes(router, serverlog);
};