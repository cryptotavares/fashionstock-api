var supplierRoutes = require('./supplier_routes');
var materialRoutes = require('./material_routes');

module.exports = function(router, serverlog){
    supplierRoutes(router, serverlog);
    materialRoutes(router, serverlog);
};