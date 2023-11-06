const Team = require("../models/team");
const Kit = require('../models/kit')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all teams.
exports.team_list = asyncHandler(async (req, res, next) => {
  const allTeams = await Team.find().sort({ name: 1}).populate('league').exec()

  res.render('team_list', {
    title: 'List of teams',
    team_list: allTeams
  })
});

// Display detail page for a specific Team.
exports.team_detail = asyncHandler(async (req, res, next) => {
  const [team, kitsFromTeam] = await Promise.all([
    Team.findById(req.params.id).populate('league').exec(),
    Kit.find({ team: req.params.id }).populate('team').exec()
  ]);

  if (team === null) {
    const err = new Error('Team Not Found');
    err.status = 404;
    return next(err)
  }

  res.render("team_detail", {
    title: 'Team Detail',
    team: team,
    kits: kitsFromTeam,
  });
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
