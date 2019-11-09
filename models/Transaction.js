const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
    type: String,
    rate: String,
    quantity: Number
}, {
    timestamps: true
});

transactionSchema.statics = {
    load: function (_id) {
        return this.findOne({ _id })
            .populate('stock', '_id name price')
            .exec();
    },
};

mongoose.model('Transaction', transactionSchema);
