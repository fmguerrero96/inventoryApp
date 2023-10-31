const KitInstance = require("../models/kitinstance");
const asyncHandler = require("express-async-handler");

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
  res.send(`NOT IMPLEMENTED: KitInstance detail: ${req.params.id}`);
});

// Display KitInstance create form on GET.
exports.kitinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: KitInstance create GET");
});

// Handle KitInstance create on POST.
exports.kitinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: KitInstance create POST");
});

// Display KitInstance delete form on GET.
exports.kitinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: KitInstance delete GET");
});

// Handle KitInstance delete on POST.
exports.kitinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: KitInstance delete POST");
});

// Display KitInstance update form on GET.
exports.kitinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: KitInstance update GET");
});

// Handle KitInstance update on POST.
exports.kitinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: KitInstance update POST");
});
