const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleError = (err) => {
  let errors = {};

  //incorrect email from login static
  if (err.message == "Incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message == "Incorrect password") {
    errors.password = err.message;
  }

  // sign up duplicate email entry error
  if (err.code == 11000) {
    errors["email"] = err.keyValue.email + "  This email already registered.";
    return errors;
  }

  // validation error
  if (
    err.message.includes("user validation failed") ||
    err._message == "user validation failed"
  ) {
    Object.values(err.errors).forEach(({ properties }) => {
      // if password error exist plus of have minlength error
      if (properties.path == "password" && properties.type == "minlength") {
        errors["password"] = "Password length must be above 6 characters";
      } else {
        errors[properties.path] = properties.message;
      }
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const getToken = (id) => {
  return jwt.sign({ id }, "secret-key", {
    expiresIn: maxAge,
  });
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = getToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).send({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = getToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
