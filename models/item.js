const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 250},
    description: {type: String, maxLength: 1000},
    price: {type: Number, min: 0.0},
    number_in_stock: {type: Number, default: 0},
    category:[{type: Schema.Types.ObjectId, ref: 'Category'}]
});

ItemSchema.virtual('url').get(function () {
    return `/category/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);