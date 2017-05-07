var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cost: String,
    price: String,
    size: String,
    prod_time: String,
    description: String,
    user_id: {
        type: String,
        required: true
    },
    materials: [{
        material_id: String,
        quantity: Number
    }],
    stock: Number,
    created_on: Date,
    lastUpdate: Date
});

module.exports = mongoose.model('Product', ProductSchema);
