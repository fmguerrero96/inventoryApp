const League = require("../models/league");
const Kit = require("../models/kit");
const Team = require("../models/team")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.league_create_get = (req, res, next) => {
  res.render("league_form", { title: "Create League"})
};

// Handle League create on POST.
exports.league_create_post = [
  // Validate and sanitize the name/country field.
  body("name", "League name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("country", "The country must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a league object with escaped and trimmed data.
    const league = new League({ name: req.body.name, country: req.body.country });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("league_form", {
        title: "Create League",
        league: league,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if League with same name already exists.
      const leagueExists = await League.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (leagueExists) {
        // League exists, redirect to its detail page.
        res.redirect(leagueExists.url);
      } else {
        await league.save();
        // New league saved. Redirect to league detail page.
        res.redirect(league.url);
      }
    }
  }),
]

// Display League delete form on GET.
exports.league_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of league and all its teams (in parallel)
  const [league, allLeagueTeams] = await Promise.all([
    League.findById(req.params.id).exec(),
    Team.find({ league: req.params.id }, 'name league city').populate('league').exec(),
  ]);

  if(league === null){
    //No results
    res.redirect("/catalog/leagues")
  }

  res.render('league_delete', {
    title: 'Delete league',
    league: league,
    league_teams: allLeagueTeams
  })
});

// Handle League delete on POST.
exports.league_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of league and all its teams (in parallel)
  const [league, allLeagueTeams] = await Promise.all([
    League.findById(req.params.id).exec(),
    Team.find({ league: req.params.id }, 'name league city').populate('league').exec(),
  ]);

  if(allLeagueTeams.length > 0){
    //league has teams associated to it. Render the form as in the GET route
    res.render('league_delete', {
      title: 'Delete league',
      league: league,
      league_teams: allLeagueTeams
    })
    return
  } else {
    // League has no teams. Delete object and redirect to the list of leagues.
    await League.findByIdAndRemove(req.body.leagueid);
    res.redirect("/catalog/leagues");
  }
});

// Display League update form on GET.
exports.league_update_get = asyncHandler(async (req, res, next) => {
  //Get league
  const league = await League.findById(req.params.id).exec()

  if (league === null) {
    // No results.
    const err = new Error("League not found");
    err.status = 404;
    return next(err);
  }

  res.render('league_form', {
    title: 'Update League',
    league: league
  })
});

// Handle League update on POST.
exports.league_update_post = [
  // Validate and sanitize the name/country field.
  body("name", "League name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("country", "The country must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a league object with escaped and trimmed data.
    const league = new League({ name: req.body.name, 
      country: req.body.country, _id: req.params.id });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("league_form", {
        title: "Update League",
        league: league,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedleague = await League.findByIdAndUpdate(req.params.id, league, {});
      // Redirect to book detail page.
      res.redirect(updatedleague.url);
    }
  })
]
