const mongoose = require('mongoose');
const { Decimal128 } = require('bson');

const Schema = mongoose.Schema;

const KitInstanceSchema = new Schema({
    kit: { type: Schema.Types.ObjectId, ref: "Kit", required: true },
    price: { type: Decimal128, required: true, maxLength: 100 },
    size: {
        type: String,
        required: true,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        default: "M",
      },
    in_stock: { type: Boolean, default: true, }
  });

// Virtual for kitInstance's URL
KitInstanceSchema.virtual("url").get(function () {
    return `/catalog/kitinstance/${this._id}`;
  });

module.exports = mongoose.model("KitInstance", KitInstanceSchema);