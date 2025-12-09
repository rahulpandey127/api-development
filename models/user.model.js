let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    enum: ["Mau", "Lucknow", "Noida"],
    required: true,
  },
  profile_pic: {
    type: String,
  },
});

let User = mongoose.model("User", userSchema);

module.exports = User;
