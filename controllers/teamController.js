const Team = require("../models/team");
const asyncHandler = require("express-async-handler");

// Display list of all teams.
exports.team_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team list");
});

// Display detail page for a specific Team.
exports.team_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Team detail: ${req.params.id}`);
});

// Display Team create form on GET.
exports.team_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team create GET");
});

// Handle Team create on POST.
exports.team_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team create POST");
});

// Display Team delete form on GET.
exports.team_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team delete GET");
});

// Handle Team delete on POST.
exports.team_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team delete POST");
});

// Display Team update form on GET.
exports.team_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team update GET");
});

// Handle Team update on POST.
exports.team_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Team update POST");
});
