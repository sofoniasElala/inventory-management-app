const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const ejs = require('ejs');
const path = require('path');

exports.category_list = asyncHandler(async(req, res, next) => {
    const categories = await Category.find().sort({name: 1}).exec();
    const allCategoriesEJS = await ejs.renderFile(path.join(__dirname, '../views/category_list.ejs'), {
        title: 'All categories',
        categories: categories
    })
    res.render('layout', {
        body: allCategoriesEJS
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, allItemsByCategory] = await Promise.all([
         Category.findById(`${req.params.id}`).exec(),
         Item.find({category: req.params.id}, 'name description').exec()
    ]);
    const categoryDetailEJS = await ejs.renderFile(path.join(__dirname, '../views/category_detail.ejs'), {
        category,
        items: allItemsByCategory
    })

    res.render('layout', {
        body: categoryDetailEJS
    });

})