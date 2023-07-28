const mongoose = require('mongoose');
const {Schema} = mongoose;
const connection = require('../libs/connection');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'price - non zero, positive'
        }
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },

    images: [String]
});

module.exports = connection.model('Product', productSchema);
