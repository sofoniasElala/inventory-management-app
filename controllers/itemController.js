const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const ejs = require('ejs');
const path = require('path');


// list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
    const Allitems = await Item.find({}).sort({name: 1}).populate('category').exec();
    const allItemsEJS = await ejs.renderFile(path.join(__dirname, '../views/item_list.ejs'), {
        title: 'All items',
        items: Allitems
    })
    res.render('layout', {
        body: allItemsEJS
    });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(`${req.params.id}`).populate('category').exec();
    const itemDetailEJS = await ejs.renderFile(path.join(__dirname, '../views/item_detail.ejs'), {
        item,
    })

    res.render('layout', {
        body: itemDetailEJS
    });
});