const League = require("../models/league");
const Kit = require("../models/kit");
const asyncHandler = require("express-async-handler");

// Display list of all Leagues.
exports.league_list = asyncHandler(async (req, res, next) => {
  const leagues = await League.find().sort({ name: 1}).exec()

  res.render('league_list', {title: 'List of Leagues', league_list: leagues,})
});

// Display detail page for a specific League.
exports.league_detail = asyncHandler(async (req, res, next) => {
  const [league, kits] = await Promise.all([
    League.findById(req.params.id).exec(),
    Kit.find({}, "team season").populate('team').exec()
  ]);

  if(league === null){
    const err = new Error('League not found')
    err.status = 404
    return next(err)
  }

  // Filter the kits that belong to the specified league
  const kitsInLeague = kits.filter((kit) => kit.team.league.toString() === req.params.id);
  
  res.render('league_detail', {
    title: 'League Detail',
    league: league,
    league_kits: kitsInLeague,
  });
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
