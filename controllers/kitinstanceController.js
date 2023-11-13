const KitInstance = require("../models/kitinstance");
const Kit = require("../models/kit")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display list of all KitInstances.
exports.kitinstance_list = asyncHandler(async (req, res, next) => {
  const all_instances = await KitInstance.find({}, "kit price size in_stock")
  .populate({
    path: 'kit',
    populate: { path: 'team' }
  })
  .sort({ team: 1 })
  .exec()

  res.render('kitInstance_list', {
    title: 'List of individual kit instances',
    kit_instances: all_instances,
  })
});

// Display detail page for a specific KitInstance.
exports.kitinstance_detail = asyncHandler(async (req, res, next) => {
  const kitInstance = await KitInstance.findById(req.params.id).populate({
    path: 'kit',
    populate: { path: 'team' }
  }).exec()

  if (kitInstance === null) {
    const err = new Error('Kit Instance Not Found');
    err.status = 404;
    return next(err)
  }

  res.render('kitInstance_detail', {
    title: 'Instance',
    kitInstance: kitInstance,
  })
});

// Display KitInstance create form on GET.
exports.kitinstance_create_get = asyncHandler(async (req, res, next) => {
  const allKits = await Kit.find({}, "team season").populate("team").exec()

  res.render("kitinstance_form", {
    title: "Create kit instance",
    kit_list: allKits,
  })
});

// Handle KitInstance create on POST.
exports.kitinstance_create_post = [
  body("kit")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify a kit"),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .isDecimal()
    .withMessage('Please provide a valid price between 0 and 1000.')
    .escape(),
  body("size")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify a size"),
  body('in_stock')
    .isBoolean(),
  
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a kitInstance object with escaped and trimmed data.
    const kitInstance = new KitInstance({
      kit: req.body.kit,
      price: req.body.price,
      size: req.body.size,
      in_stock: req.body.in_stock,
    })

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allKits = await Kit.find({}, "team season").populate("team").exec()

      res.render("kitinstance_form", {
        title: "Create kit instance",
        kit_list: allKits,
        selected_kit: kitInstance.kit._id,
        errors: errors.array(),
        kitInstance: kitInstance,
      });
      return;
    } else {
      // Data from form is valid
      await kitInstance.save();
      res.redirect(kitInstance.url);
    }
  })
]

// Display KitInstance delete form on GET.
exports.kitinstance_delete_get = asyncHandler(async (req, res, next) => {
  const kitInstance = await KitInstance.findById(req.params.id)
    .populate({
      path: 'kit',
      populate: { path: 'team' }
    }).exec()

  if(kitInstance === null){
    //no results 
    res.redirect('/catalog/kitinstances')
  }

  res.render('kitinstance_delete', {
    title: 'Delete Kit Instance',
    kitInstance: kitInstance,
  })
});

// Handle KitInstance delete on POST.
exports.kitinstance_delete_post = asyncHandler(async (req, res, next) => {
  const kitInstance = await KitInstance.findById(req.params.id)
    .populate({
      path: 'kit',
      populate: { path: 'team' }
    }).exec()

  if(kitInstance){
    //Instance exists
    await KitInstance.findByIdAndRemove(req.body.instanceid);
    res.redirect("/catalog/kitinstances");
  } else {
    res.redirect("/catalog/kitinstances")
  }
});

// Display KitInstance update form on GET.
exports.kitinstance_update_get = asyncHandler(async (req, res, next) => {
  //Get instance info and all kits for form.
  const [kitInstance, allKits] = await Promise.all([
    KitInstance.findById(req.params.id).populate('kit').exec(),
    Kit.find({}, "team season").populate("team").exec(),
  ])

  if (kitInstance === null) {
    // No results.
    const err = new Error("Instance not found");
    err.status = 404;
    return next(err);
  }

  res.render('kitinstance_form', {
    title: 'Update Instance',
    kit_list: allKits,
    kitInstance: kitInstance
  })
});

// Handle KitInstance update on POST.
exports.kitinstance_update_post = [
  body("kit")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify a kit"),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .isDecimal()
    .withMessage('Please provide a valid price between 0 and 1000.')
    .escape(),
  body("size")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify a size"),
  body('in_stock')
    .isBoolean(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a kitInstance object with escaped/trimmed data and old _id.
    const kitInstance = new KitInstance({
      kit: req.body.kit,
      price: req.body.price,
      size: req.body.size,
      in_stock: req.body.in_stock,
      _id: req.params.id,
    })

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allKits = await Kit.find({}, "team season").populate("team").exec()

      res.render("kitinstance_form", {
        title: "Update instance",
        kit_list: allKits,
        selected_kit: kitInstance.kit._id,
        errors: errors.array(),
        kitInstance: kitInstance,
      });
      return;
    } else {
      // Data from form is valid. Update record
      const updatedInstance = await KitInstance.findByIdAndUpdate(req.params.id, kitInstance, {})
      res.redirect(updatedInstance.url)
    }

  })
]
