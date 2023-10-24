const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const KitSchema = new Schema({
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true, },
    season: { type: String, required: true, maxLength: 100 },
  });

// Virtual for kit's URL
KitSchema.virtual("url").get(function () {
    return `/catalog/kit/${this._id}`;
  });

module.exports = mongoose.model("Kit", KitSchema);