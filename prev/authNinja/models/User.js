const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
});

// userSchema.post('save', function (doc, next) {
//   next()
// })
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// statis method for login
userSchema.statics.login = async function (email, password) {
  // console.log("statics");
  const user = await this.findOne({ email });
  if (user) {
    // console.log("Eamil");
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      // console.log("password", user._id);
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};
const User = mongoose.model("user", userSchema);

module.exports = User;
