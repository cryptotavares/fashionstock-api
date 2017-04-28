var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SupplierSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        required: true
    },
    email: String,
    telephone: String,
    address: String,
    city: String,
    country: String,
    created_on: Date,
    lastUpdate: Date
});

module.exports = mongoose.model('Supplier', SupplierSchema);
