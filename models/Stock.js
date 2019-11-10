const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Stock Schema
 */
const stockSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    portfolio: [{ type: Schema.Types.ObjectId, ref: 'Portfolio' }],
    transaction: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
}, {
    timestamps: true
});

/**
 * Statics
 */
stockSchema.statics = {
    /**
    * LoadAll: includes eager loading of portfolio & transaction
    *
    * @api private
    */
    loadAll: function () {
        return this.find()
            .populate('portfolio')
            .populate('transaction')
            .exec();
    },

    /**
     * Load one: includes eager loading of portfolio & transaction
     * @param {ObjectId} _id 
     * @api private
     */
    load: function (_id) {
        return this.findOne({ _id })
            .populate('portfolio')
            .populate('transaction')
            .exec();
    },
};

mongoose.model('Stock', stockSchema);
