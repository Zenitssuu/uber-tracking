const mongoose = require('mongoose');

const CaptainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Captain', CaptainSchema);