const supplierRoutes = require('./supplier_routes');

module.exports = function(router, Supplier, serverlog){
    supplierRoutes(router, Supplier, serverlog);
};