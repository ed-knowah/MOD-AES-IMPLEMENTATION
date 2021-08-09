const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true},
  password: { type: String },
  address: String,
  city: String,
  gender: String,
  zip: String,
  encryptedData: String,
  fileKey: { type: String },
  fileName: String,
  fileOriginalName: String,
});

const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
