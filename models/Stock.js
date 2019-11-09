const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

mongoose.model('Stock', stockSchema);
