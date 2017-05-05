var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    email: {
        type: String,
        required: true
    },
    token: String,
    admin: Boolean,
    created_on: Date,
    lastUpdate: Date
});

module.exports = mongoose.model('User', UserSchema);
