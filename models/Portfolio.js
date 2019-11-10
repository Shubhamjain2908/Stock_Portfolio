const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Portfolio Schema
 */
const portfolioSchema = new Schema({
    average: String,
    quantity: Number,
    stock: { type: Schema.Types.ObjectId, ref: 'Stock', required: true },
}, {
    timestamps: true
});

/**
 * Statics
 */
portfolioSchema.statics = {

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

    /**
     * Load One: includes eager loading of stock 
     * @param {ObjectId} _id 
     * @api private
     */
    load: function (_id) {
        return this.findOne({ _id })
            .populate('stock', '_id name price')
            .exec();
    },
};

mongoose.model('Portfolio', portfolioSchema);
