const mongoose = require("mongoose");
const { Schema } = mongoose;

const animalSchema = new Schema({
  name: {
    type: String,
    required: [true, "The animal must to have a name"],
  },
  image: {
    type: String,
  },
  age: {
    years: {
      type: Number,
      min: 0,
    },
    months: {
      type: Number,
      min: 0,
      max: 11,
    },
  },
});

module.exports = mongoose.model("Animal", animalSchema);
