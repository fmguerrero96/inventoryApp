const Kit = require("../models/kit");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all kits.
exports.kit_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Kit list");
});

// Display detail page for a specific kit.
exports.kit_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: kit detail: ${req.params.id}`);
});

// Display kit create form on GET.
exports.kit_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: kit create GET");
});

// Handle kit create on POST.
exports.kit_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: kit create POST");
});

// Display kit delete form on GET.
exports.kit_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: kit delete GET");
});

// Handle kit delete on POST.
exports.kit_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: kit delete POST");
});

// Display kit update form on GET.
exports.kit_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: kit update GET");
});

// Handle kit update on POST.
exports.kit_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: kit update POST");
});
