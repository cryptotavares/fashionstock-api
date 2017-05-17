var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MaterialSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    supplier_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    cost: String,
    reference: String,
    details: String,
    stock: Number,
    stock_unit: String,
    created_on: Date,
    lastUpdate: Date
});

module.exports = mongoose.model('Material', MaterialSchema);
