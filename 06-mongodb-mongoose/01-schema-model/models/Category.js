const mongoose = require('mongoose');
const {Schema} = mongoose;
const connection = require('../libs/connection');

const subCategorySchema = new Schema({
    title: {
        type: String,
        required: true
    }
});

connection.model('SubCategory', subCategorySchema);

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subcategories: [subCategorySchema]
});

module.exports = connection.model('Category', categorySchema);
