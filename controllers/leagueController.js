const League = require("../models/league");
const asyncHandler = require("express-async-handler");

// Display list of all Leagues.
exports.league_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League list");
});

// Display detail page for a specific League.
exports.league_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: League detail: ${req.params.id}`);
});

// Display League create form on GET.
exports.league_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League create GET");
});

// Handle League create on POST.
exports.league_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League create POST");
});

// Display League delete form on GET.
exports.league_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League delete GET");
});

// Handle League delete on POST.
exports.league_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League delete POST");
});

// Display League update form on GET.
exports.league_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League update GET");
});

// Handle League update on POST.
exports.league_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: League update POST");
});
