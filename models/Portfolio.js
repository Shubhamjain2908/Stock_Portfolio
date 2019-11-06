const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
    average: String,
    quantity: Number,
    _stockId: { type: Schema.Types.ObjectId, ref: 'Stock' },
}, {
    timestamps: true
});

mongoose.model('Portfolio', portfolioSchema);
