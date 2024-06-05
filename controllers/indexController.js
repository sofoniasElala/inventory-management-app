const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const ejs = require('ejs');
const path = require('path');

exports.index = asyncHandler(async (req, res, next) => {
    const [categoriesCount, itemCount] = await Promise.all([
         Category.countDocuments({}).exec(), 
         Item.countDocuments({}).exec()
    ]);

    const indexEJS = await ejs.renderFile(path.join(__dirname, '../views/index.ejs'), {
        title: 'Inventory Management Home',
        item_count: itemCount,
        categories_count: categoriesCount
    });

    res.render('layout', {
        body: indexEJS
    });
    
});