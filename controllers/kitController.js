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
  const allTeams = await Team.find({}, "name").exec()

  res.render("kit_form", {
    title: "Create new kit",
    team_list: allTeams
  })
});

// Handle kit create on POST.
exports.kit_create_post = [
  body("team")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Team name must be specified."),
  body('season')
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("Please specify a season for the kit (i.e. 2002-2003)."),
  
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
     // Extract the validation errors from a request.
     const errors = validationResult(req);

  //Create a kit object with trimmed and escaped data.
  const kit = new Kit({
    team: req.body.team,
    season: req.body.season
  })

  if (!errors.isEmpty()) {
    // There are errors.
    // Render form again with sanitized values and error messages.
    const allTeams = await Team.find({}, "name").exec()

    res.render("kit_form", {
      title: "Create new kit",
      team_list: allTeams,
      selected_team: kit.team._id,
      errors: errors.array(),
      kit: kit,
    });
    return;
  } else {
    // Data from form is valid
    await kit.save();
    res.redirect(kit.url);
    }
  })
]

// Display kit delete form on GET.
exports.kit_delete_get = asyncHandler(async (req, res, next) => {
  const [kit, allKitInstances] = await Promise.all([
    Kit.findById(req.params.id).populate('team').exec(),
    KitInstance.find({ kit: req.params.id }, 'kit price size in_stock')
      .populate('kit').exec()
  ]);

  if(kit === null){
    //no results
    res.redirect('/catalog/kits')
  }

  res.render('kit_delete', {
    title: 'Delete Kit',
    kit: kit,
    kit_instances: allKitInstances
  })
});

// Handle kit delete on POST.
exports.kit_delete_post = asyncHandler(async (req, res, next) => {
  //Get kit info and all kit instances associated to it
  const [kit, allKitInstances] = await Promise.all([
    Kit.findById(req.params.id).populate('team').exec(),
    KitInstance.find({ kit: req.params.id }, 'kit price size in_stock')
      .populate('kit').exec()
  ]);

  if(allKitInstances.length > 0){
    //Kit has instances associated to it, render delete form as in GET route
    res.render('kit_delete', {
      title: 'Delete Kit',
      kit: kit,
      kit_instances: allKitInstances
    })
    return
  } else {
    // Kit has no instances. Delete object and redirect to the list of leagues.
    await Kit.findByIdAndRemove(req.body.kitid);
    res.redirect("/catalog/kits");
  }
});

// Display kit update form on GET.
exports.kit_update_get = asyncHandler(async (req, res, next) => {
  //Get kit info and all Teams for form.
  const [kit, allTeams] = await Promise.all([
    Kit.findById(req.params.id).populate('team').exec(),
    Team.find().exec(),
  ])

  if(kit === null){
    //No Results.
    const err = new Error("Kit not found");
    err.status = 404;
    return next(err);
  }

  res.render('kit_form', {
    title: 'Update Kit',
    kit: kit,
    team_list: allTeams
  })
});

// Handle kit update on POST.
exports.kit_update_post = [
  body("team")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Team name must be specified."),
  body('season')
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("Please specify a season for the kit (i.e. 2002-2003)."),
  
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    //Create a kit object with trimmed and escaped data.
  const kit = new Kit({
    team: req.body.team,
    season: req.body.season,
    _id: req.params.id,
  })

  if (!errors.isEmpty()) {
    // There are errors.
    // Render form again with sanitized values and error messages.
    const allTeams = await Team.find({}, "name").exec()

    res.render("kit_form", {
      title: "Update kit",
      team_list: allTeams,
      //selected_team: kit.team._id,
      errors: errors.array(),
      kit: kit,
    });
    return;
  } else {
    // Data from form is valid. Update the record.
    const updatedKit = await Kit.findByIdAndUpdate(req.params.id, kit, {});
    //Redirect to detail page.
    res.redirect(updatedKit.url)
  }
  })
]
