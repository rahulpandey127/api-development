let mongoose = require("mongoose");
let dotenv = require("dotenv");
dotenv.config();
let mongoURI = process.env.MONGO_URL;
let mongooseConnect = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongooseConnect;
