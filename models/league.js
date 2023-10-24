const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    country: { type: String, required: true, maxLength: 100 },
  });

// Virtual for league's URL
LeagueSchema.virtual("url").get(function () {
    return `/catalog/league/${this._id}`;
  });

module.exports = mongoose.model("League", LeagueSchema);