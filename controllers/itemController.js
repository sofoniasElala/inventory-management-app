const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');


// list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
    const Allitems = Item.find({}, 'name description').sort({name: 1}).populate('category').exec();
    res.render('item_list', {
        title: 'All items',
        items: Allitems
    });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = Item.findById(`${req.params.id}`).populate('category').exec();

    res.render('item_detail', {
        title: 'Item detail',
        item,
    });
});