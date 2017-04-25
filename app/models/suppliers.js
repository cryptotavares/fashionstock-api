var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SupplierSchema = new Schema({
    name: String,
    email: String,
    telephone: String,
    address: String,
    city: String,
    country: String,
    created_on: Date,
    lastUpdate: Date
});

module.exports = mongoose.model('Supplier', SupplierSchema);
