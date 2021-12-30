const mongoose = require("mongoose");
const { Schema } = mongoose;

const shelterSchema = new Schema({
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

module.exports = mongoose.model("Shelter", shelterSchema);
