const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const ejs = require('ejs');
const path = require('path');
const category = require('../models/category');
const {body, validationResult} = require('express-validator');

// Display list of all Category.
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

// Display detail page for a specific Category.
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

});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
    const categoryFormEJS = await ejs.renderFile(path.join(__dirname, '../views/category_form.ejs'), {
        title: 'Create Category',
        category: undefined,
        errors: []
    });
    res.render('layout', {body: categoryFormEJS});
});

// Handle Category create on POST.
exports.category_create_post = [
    // Validate and sanitize the name field.
    body("name", "Category name must contain at least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a category object with escaped and trimmed data.
      const category = new Category({ name: req.body.name, description: req.body.description });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
  
        const categoryFormEJS = await ejs.renderFile(path.join(__dirname, '../views/category_form.ejs'), {
          title: 'Create Category',
          category: category,
          errors: errors.array()
        });
  
        res.render("layout", {
          body: categoryFormEJS
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Category with same name already exists.
        const categoryExists = await Category.findOne({ name: req.body.name })
          .collation({ locale: "en", strength: 2 })
          .exec();
        if (categoryExists) {
          // Category exists, redirect to its detail page.
          res.redirect(categoryExists.url);
        } else {
          await category.save();
          // New category saved. Redirect to category detail page.
          res.redirect(category.url);
        }
      }
    }),
  ];


// Handle Category update on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(`${req.params.id}`).exec();
    const categoryFormEJS = await ejs.renderFile(path.join(__dirname, '../views/category_form.ejs'), {
        title: 'Update Category',
        category: category,
        errors: []
    });
    res.render('layout', {body: categoryFormEJS});
});


// Handle Category update on POST.
exports.category_update_post = [
    // Validate and sanitize the name field.
    body("name", "Category name must contain at least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
  
        const categoryFormEJS = await ejs.renderFile(path.join(__dirname, '../views/category_form.ejs'), {
          title: 'Update Category',
          category: req.body,
          errors: errors.array()
        });
  
        res.render("layout", {
          body: categoryFormEJS
        });
        return;
      } else {
        // Data from form is valid.
        await Category.findByIdAndUpdate(`${req.params.id}`, req.body);
          //  category updated. Redirect to category detail page.
          res.redirect(`/category/${req.params.id}`);
    
      }
    }),
  ];


// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of item
    const category = await Category.findById(`${req.params.id}`).exec();
  
    if (category === null) {
      // No results.
      res.redirect("/category/all");
    }
    const deleteCategoryFormEJS = await ejs.renderFile(path.join(__dirname, '../views/category_delete.ejs'), {
      title: "Delete Category",
      category: category,
    });
  
    res.render("layout", {
      body: deleteCategoryFormEJS,
    });
  });
  

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
      await Category.findByIdAndDelete(req.body.categoryid);
      res.redirect("/category/all");

  });

