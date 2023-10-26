const express = require("express");
const router = express.Router();

// Require controller modules.
const kit_controller = require("../controllers/kitController");
const team_controller = require("../controllers/teamController");
const league_controller = require("../controllers/leagueController");
const kit_instance_controller = require("../controllers/kitinstanceController");

/// KIT ROUTES ///

// GET catalog home page.
router.get("/", kit_controller.index);

// GET request for creating a kit. NOTE This must come before routes that display kit (uses id).
router.get("/kit/create", kit_controller.kit_create_get);

// POST request for creating kit.
router.post("/kit/create", kit_controller.kit_create_post);

// GET request to delete kit.
router.get("/kit/:id/delete", kit_controller.kit_delete_get);

// POST request to delete kit.
router.post("/kit/:id/delete", kit_controller.kit_delete_post);

// GET request to update kit.
router.get("/kit/:id/update", kit_controller.kit_update_get);

// POST request to update kit.
router.post("/kit/:id/update", kit_controller.kit_update_post);

// GET request for one kit.
router.get("/kit/:id", kit_controller.kit_detail);

// GET request for list of all kit items.
router.get("/kits", kit_controller.kit_list);

/// TEAM ROUTES ///

// GET request for creating team. NOTE This must come before route for id (i.e. display team).
router.get("/team/create", team_controller.team_create_get);

// POST request for creating team.
router.post("/team/create", team_controller.team_create_post);

// GET request to delete team.
router.get("/team/:id/delete", team_controller.team_delete_get);

// POST request to delete team.
router.post("/team/:id/delete", team_controller.team_delete_post);

// GET request to update team.
router.get("/team/:id/update", team_controller.team_update_get);

// POST request to update team.
router.post("/team/:id/update", team_controller.team_update_post);

// GET request for one team.
router.get("/team/:id", team_controller.team_detail);

// GET request for list of all teams.
router.get("/teams", team_controller.team_list);

/// LEAGUE ROUTES ///

// GET request for creating a league. NOTE This must come before route that displays leagues (uses id).
router.get("/league/create", league_controller.league_create_get);

//POST request for creating league.
router.post("/league/create", league_controller.league_create_post);

// GET request to delete league.
router.get("/league/:id/delete", league_controller.league_delete_get);

// POST request to delete league.
router.post("/league/:id/delete", league_controller.league_delete_post);

// GET request to update league.
router.get("/league/:id/update", league_controller.league_update_get);

// POST request to update league.
router.post("/league/:id/update", league_controller.league_update_post);

// GET request for one league.
router.get("/league/:id", league_controller.league_detail);

// GET request for list of all leagues.
router.get("/leagues", league_controller.league_list);

/// KITINSTANCE ROUTES ///

// GET request for creating a kitinstance. NOTE This must come before route that displays kitinstance (uses id).
router.get(
  "/kitinstance/create",
  kit_instance_controller.kitinstance_create_get,
);

// POST request for creating kitinstance.
router.post(
  "/kitinstance/create",
  kit_instance_controller.kitinstance_create_post,
);

// GET request to delete kitInstance.
router.get(
  "/kitinstance/:id/delete",
  kit_instance_controller.kitinstance_delete_get,
);

// POST request to delete kitInstance.
router.post(
  "/kitinstance/:id/delete",
  kit_instance_controller.kitinstance_delete_post,
);

// GET request to update kitInstance.
router.get(
  "/kitinstance/:id/update",
  kit_instance_controller.kitinstance_update_get,
);

// POST request to update kitInstance.
router.post(
  "/kitinstance/:id/update",
  kit_instance_controller.kitinstance_update_post,
);

// GET request for one kitInstance.
router.get("/kitinstance/:id", kit_instance_controller.kitinstance_detail);

// GET request for list of all kitInstance.
router.get("/kitinstances", kit_instance_controller.kitinstance_list);

module.exports = router;
