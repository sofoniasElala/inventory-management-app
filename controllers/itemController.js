const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const ejs = require('ejs');
const path = require('path');
const {body, validationResult} = require('express-validator');


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

//GET the details of a specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(`${req.params.id}`).populate('category').exec();
    const itemDetailEJS = await ejs.renderFile(path.join(__dirname, '../views/item_detail.ejs'), {
        item,
    })

    res.render('layout', {
        body: itemDetailEJS
    });
});

// Handle item create on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({name: 1}).exec();
    const itemFormEJS = await ejs.renderFile(path.join(__dirname, '../views/item_form.ejs'), {
        title: 'Create Item',
        item: undefined,
        categories: allCategories,
        errors: []
    });
    res.render('layout', {body: itemFormEJS});
});

// Handle item create on POST.
exports.item_create_post = [
    // Convert the category to an array.
    (req, res, next) => {
      if (!Array.isArray(req.body.category)) {
        req.body.category =
          typeof req.body.category === "undefined" ? [] : [req.body.category];
      }
      next();
    },
  
    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body("description")
      .trim()
      .escape(),
    body("price").trim().escape(),
    body("number_in_stock").trim().escape(),
    body("category.*").escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Item object with escaped and trimmed data.
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.number_in_stock,
        category: req.body.category,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all categories for form.
        const allCategories = await Category.find().sort({ name: 1 }).exec();
  
        // Mark our selected categories as checked.
        for (const category of allCategories) {
          if (item.category.includes(category._id)) {
            category.checked = "true";
          }
        }
        const itemFormEJS = await ejs.renderFile(path.join(__dirname, '../views/item_form.ejs'), {
            title: 'Create Item',
            item: item,
            categories: allCategories,
            errors: errors.array()
        });
        res.render('layout', {body: itemFormEJS});
      } else {
        // Data from form is valid. Save item.
        await item.save();
        res.redirect(item.url);
      }
    }),
  ];

// Handle Item update on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [allCategories, item] = await Promise.all([
        Category.find().sort({name: 1}).exec(),
        Item.findById(`${req.params.id}`).exec()
    ]);
    // Mark our selected categories as checked.
    for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }
    const itemFormEJS = await ejs.renderFile(path.join(__dirname, '../views/item_form.ejs'), {
        title: 'Update Item',
        item: item,
        categories: allCategories,
        errors: []
    });
    res.render('layout', {body: itemFormEJS});
});

// Handle Item update on POST.
exports.item_update_post =[
     // Convert the category to an array.
     (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
          req.body.category =
            typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
      },
    
      // Validate and sanitize fields.
      body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 3 })
        .escape(),
      body("description")
        .trim()
        .escape(),
      body("price").trim().escape(),
      body("number_in_stock").trim().escape(),
      body("category.*").escape(),
      // Process request after validation and sanitization.
      asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
    
          // Get all categories for form.
          const allCategories = await Category.find().sort({ name: 1 }).exec();
    
          // Mark our selected categories as checked.
          for (const category of allCategories) {
            if (req.body.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          const itemFormEJS = await ejs.renderFile(path.join(__dirname, '../views/item_form.ejs'), {
              title: 'Update Item',
              item: req.body,
              categories: allCategories,
              errors: errors.array()
          });
          res.render('layout', {body: itemFormEJS});
        } else {
          // Data from form is valid. update item.
          await Item.findByIdAndUpdate(`${req.params.id}`, req.body);
          //  item updated. Redirect to item detail page.
          res.redirect(`/item/${req.params.id}`);
        }
      }),
    ];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of item
    const item = await Item.findById(`${req.params.id}`).exec();
  
    if (item === null) {
      // No results.
      res.redirect("/item/all");
    }
    const deleteItemFormEJS = await ejs.renderFile(path.join(__dirname, '../views/item_delete.ejs'), {
      title: "Delete Item",
      item: item,
    });
  
    res.render("layout", {
      body: deleteItemFormEJS,
    });
  });
  

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
      await Item.findByIdAndDelete(req.body.itemid);
      res.redirect("/item/all");

  });