const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
    average: String,
    quantity: Number,
    _stockId: { type: Schema.Types.ObjectId, ref: 'Stock', required: true },
}, {
    timestamps: true
});

mongoose.model('Portfolio', portfolioSchema);
