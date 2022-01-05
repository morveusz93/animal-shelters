const mongoose = require("mongoose");
const { Schema } = mongoose;
const Animal = require("../models/animal");

const shelterSchema = new Schema({
  animals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Animal",
    },
  ],
  name: {
    type: String,
    required: [true, "The shelter must to have a name"],
  },
  address: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
  },
  email: {
    type: String,
  },
});

shelterSchema.post("findOneAndDelete", async function (shelter) {
  if (shelter.animals.length) {
    const res = await Animal.deleteMany({ _id: { $in: shelter.animals } });
  }
});

module.exports = mongoose.model("Shelter", shelterSchema);
