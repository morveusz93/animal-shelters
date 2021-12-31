const mongoose = require("mongoose");
const { Schema } = mongoose;

const animalSchema = new Schema({
  type: {
    type: String,
    enum: ["dog", "cat", "rabbit", "horse", "other"],
    required: true,
  },
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
      required: true,
      min: 0,
    },
    months: {
      type: Number,
      min: 0,
      required: true,
      max: 11,
    },
  },
  shelter: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
    // required: true,
  },
});

module.exports = mongoose.model("Animal", animalSchema);
