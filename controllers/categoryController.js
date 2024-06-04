const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async(req, res, next) => {
    const categories = await Category.find().sort({name: 1}).exec();
    res.render('category_list', {
        title: 'All categories',
        categories: categories
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, allItemsByCategory] = Promise.all([
        await Category.findById(`${req.params.id}`).exec(),
        await Item.find({category: req.params.id}, 'name description').exec()
    ]);

    res.render('category_detail', {
        category,
        items: allItemsByCategory
    });

})