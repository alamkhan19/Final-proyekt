const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String },
  address:     { type: String },
  rating:      { type: Number, min: 1, max: 5 },
  photo:       { type: String },
  mood:        { type: String },
  city:        { type: String, default: "Bakı" },
  price:       { type: String },
  phone:       { type: String },
  hours:       { type: String },
  mapLink:     { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);