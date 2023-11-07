const Kit = require("../models/kit");
const League = require("../models/league")
const Team = require("../models/team")
const KitInstance = require("../models/kitinstance")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numKits,
    numLeagues,
    numTeams,
    numKitInstances,
    numKitInstancesInStock,
  ] = await Promise.all([
    Kit.countDocuments({}).exec(),
    League.countDocuments({}).exec(),
    Team.countDocuments({}).exec(),
    KitInstance.countDocuments({}).exec(),
    KitInstance.countDocuments({ in_stock: true }).exec()
  ])

  res.render("index", {
    title: "Vintage Football Kits",
    kit_count: numKits,
    league_count: numLeagues,
    team_count: numTeams,
    kitInstance_count: numKitInstances,
    inStockKits: numKitInstancesInStock
  })
});

// Display list of all kits.
exports.kit_list = asyncHandler(async (req, res, next) => {
  const allKits = await Kit.find({}, "team season")
  .populate('team')
  .sort({ team: 1 })
  .exec();

  res.render('kit_list', { title: 'List of Kits', kit_list: allKits});
});

// Display detail page for a specific kit.
exports.kit_detail = asyncHandler(async (req, res, next) => {
  const [kit, kitInstances] = await Promise.all([
    Kit.findById(req.params.id).populate({
      path: 'team',
      populate: { path: 'league' }
    }).exec(),
    KitInstance.find({ kit: req.params.id }).exec()
  ]);

  if(kit === null){
    const err = new Error('Kit not found');
    err.status = 404;
    return next(err)
  }

  res.render("kit_detail", {
    title: kit.team.name,
    kit: kit,
    kit_instances: kitInstances,
  });
});

// Display kit create form on GET.
exports.kit_create_get = asyncHandler(async (req, res, next) => {
  const allTeams = await Team.find().exec()

  res.render("kit_form", {
    title: "Create new kit",
    teams: allTeams
  })
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
