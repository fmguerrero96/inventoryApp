const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    league: { type: Schema.Types.ObjectId, ref: "League", required: true, },
    city: { type: String, required: true, maxLength: 100 }
});

// Virtual for team's URL
TeamSchema.virtual("url").get(function () {
    return `/catalog/team/${this._id}`;
  });

module.exports = mongoose.model("Team", TeamSchema);