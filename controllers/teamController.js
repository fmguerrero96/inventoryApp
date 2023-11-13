const Team = require("../models/team");
const League = require("../models/league")
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
  //Get all leagues, they're necessary for creating new teams
  const allLeagues = await League.find({}, "name").exec();

  res.render("team_form", { title: "Create Team", league_list: allLeagues })
});

// Handle Team create on POST.
exports.team_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Team name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  body("league", "League must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("city")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("City name must be specified."),

   // Process request after validation and sanitization.
   asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Team object with escaped and trimmed data.
    const team = new Team({
      name: req.body.name,
      league: req.body.league,
      city: req.body.city
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allLeagues = await League.find({}, "name").exec();

      res.render("team_form", {
        title: "Create Team",
        league_list: allLeagues,
        selected_league: team.league._id,
        errors: errors.array(),
        team: team,
      });
      return;
    } else {
      // Data from form is valid
      await team.save();
      res.redirect(team.url);
    }
  }),
]

// Display Team delete form on GET.
exports.team_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of team and all their kits (in parallel)
  const [team, allTeamKits] = await Promise.all([
    Team.findById(req.params.id).populate('league').exec(),
    Kit.find({ team: req.params.id }, "team season").populate('team').exec(),
  ]);

  if(team === null){
    //No results
    res.redirect("/catalog/teams")
  }

  res.render('team_delete', {
    title: 'Delete Team',
    team: team,
    team_kits: allTeamKits,
  })
});

// Handle Team delete on POST.
exports.team_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of team and all their kits (in parallel)
  const [team, allTeamKits] = await Promise.all([
    Team.findById(req.params.id).populate('league').exec(),
    Kit.find({ team: req.params.id }, "team season").populate('team').exec(),
  ]);

  if(allTeamKits.length > 0){
    res.render('team_delete', {
      title: 'Delete Team',
      team: team,
      team_kits: allTeamKits,
    })
    return
  } else {
     // Team has no kits. Delete object and redirect to the list of teams.
     await Team.findByIdAndRemove(req.body.teamid)
     res.redirect("/catalog/teams")
  }
});

// Display Team update form on GET.
exports.team_update_get = asyncHandler(async (req, res, next) => {
  //Get team and leagues for form.
  const [team, allLeagues] = await Promise.all([
    Team.findById(req.params.id).exec(),
    League.find().exec(),
  ])

  if (team === null) {
    // No results.
    const err = new Error("Team not found");
    err.status = 404;
    return next(err);
  }

  res.render('team_form', {
    title: 'Update Team',
    league_list: allLeagues,
    team: team,
  })
});

// Handle Team update on POST.
exports.team_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Team name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  body("league", "League must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("city")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("City name must be specified."),

    // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    // Create a Team object with escaped/trimmed data and old _id.
    const team = new Team({
      name: req.body.name,
      league: req.body.league,
      city: req.body.city,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allLeagues = await League.find({}, "name").exec();

      res.render("team_form", {
        title: "Update Team",
        league_list: allLeagues,
        errors: errors.array(),
        team: team,
      });
      return;
    } else {
      // Data from form is valid. Update record
      const updatedTeam = await Team.findByIdAndUpdate(req.params.id, team, {})
      //redirect to detail page
      res.redirect(updatedTeam.url)
    }
  })
]
