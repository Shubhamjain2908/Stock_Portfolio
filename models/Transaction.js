const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    _stockId: { type: Schema.Types.ObjectId, ref: 'Stock' },
    type: String,
    rate: String,
    quantity: Number
}, {
    timestamps: true
});

mongoose.model('Transaction', transactionSchema);
