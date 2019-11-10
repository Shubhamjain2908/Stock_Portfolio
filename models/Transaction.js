const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Transaction Schema
 */
const transactionSchema = new Schema({
    stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
    type: String,
    rate: String,
    quantity: Number
}, {
    timestamps: true
});

/**
 * Statics
 */
transactionSchema.statics = {
    /**
    * LoadAll: includes eager loading of stock
    *
    * @api private
    */
    loadAll: function () {
        return this.find()
            .populate('stock', '_id name price')
            .exec();
    },
};

mongoose.model('Transaction', transactionSchema);
