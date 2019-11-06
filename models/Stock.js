const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
    name: String,
    price: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Stock', stockSchema);
