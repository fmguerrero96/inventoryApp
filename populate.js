#! /usr/bin/env node

console.log(
    'This script populates some test kits, leagues, kit instances and teams to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Kit = require("./models/kit");
  const League = require("./models/league");
  const Team = require("./models/team");
  const KitInstance = require("./models/kitinstance");
  
  const kits = [];
  const leagues = [];
  const teams = [];
  const kitinstances = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createLeagues();
    await createTeams();
    await createKits();
    await createKitInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  

  async function leagueCreate(index, name, country) {
    const league = new League({ name: name, country: country });
    await league.save();
    leagues[index] = league;
    console.log(`Added league: ${name}`);
  }
  
  async function kitCreate(index, team, season) {
    const kitdetail = { team: team, season: season };
  
    const kit = new Kit(kitdetail);
  
    await kit.save();
    kits[index] = kit;
    console.log(`Added kit: ${team}`);
  }
  
  async function teamCreate(index, name, league, city) {
    const teamdetail = {
      name: name,
      league: league,
      city: city,
    };
  
    const team = new Team(teamdetail);
    await team.save();
    teams[index] = team;
    console.log(`Added team: ${name}`);
  }
  
  async function kitInstanceCreate(index, kit, price, size, in_stock) {
    const kitinstancedetail = {
      kit: kit,
      price: price,
      size: size,
      in_stock: in_stock
    };
  
    const kitinstance = new KitInstance(kitinstancedetail);
    await kitinstance.save();
    kitinstances[index] = kitinstance;
    console.log(`Added kitInstance: ${kit}`);
  }
  
  async function createTeams() {
    console.log("Adding teams");
    await Promise.all([
      teamCreate(0,
        "Barcelona",
        leagues[1],
        "Barcelona"
      ),
      teamCreate(1,
        "Real Madrid",
        leagues[1],
        "Madrid"
      ),
      teamCreate(2,
        "Arsenal",
        leagues[2],
        "London"
      ),
      teamCreate(3,
        "Manchester City",
        leagues[2],
        "Manchester"
      ),
      teamCreate(4,
        "Bayern Munich",
        leagues[0],
        "Munich"
      ),
      teamCreate(5,
        "Borussia Dortmund",
        leagues[0],
        "Dortmund"
      ),
      teamCreate(6,
        "AC Milan",
        leagues[3],
        "Milan"
      ),
      teamCreate(7,
        "Juventus",
        leagues[3],
        "Turin"
      ),
    ]);
  }
  
  async function createLeagues() {
    console.log("Adding leagues");
    await Promise.all([
      leagueCreate(0, "Bundesliga", "Germany" ),
      leagueCreate(1, "La Liga", "Spain"),
      leagueCreate(2, "Premier League","England" ),
      leagueCreate(3, 'Serie A', 'Italy')
    ]);
  }
  
  async function createKits() {
    console.log("Adding kits");
    await Promise.all([
      kitCreate(0, teams[0], "2004-2005"),
      kitCreate(1, teams[1], "2009-2010"),
      kitCreate(2, teams[2], "2000-2001"),
      kitCreate(3, teams[3], "2013-2014"),
      kitCreate(4, teams[4], "1993-1994"),
      kitCreate(5, teams[5], "1995-1996"),
      kitCreate(6, teams[6], "2018-2019"),
      kitCreate(7, teams[7], "2011-2012"),
    ]);
  }
  
  
  async function createKitInstances() {
    console.log("Adding instances");
    await Promise.all([
      kitInstanceCreate(0, kits[0], 105.00, 'S', true),
      kitInstanceCreate(1, kits[1], 55.99, 'L', true),
      kitInstanceCreate(2, kits[3], 158.49, 'M', false),
      kitInstanceCreate(3, kits[2], 88.34, 'XL', false),
      kitInstanceCreate(4, kits[4], 105.00, 'M', true),
      kitInstanceCreate(5, kits[7], 75.99, 'S', false),
      kitInstanceCreate(6, kits[6], 33.98, 'L', false),
      kitInstanceCreate(7, kits[5], 225.00, 'XXL', true),
    ]);
  }