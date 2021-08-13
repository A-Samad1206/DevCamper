const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret-key", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log("Decode token", decodedToken);
        next();
      }
    });
  } else {
    console.log("No such cookie exist");
    res.redirect("/login");
  }
};
//Check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret-key", async (err, decodedToken) => {
      if (err) {
        console.log("Error is token");
        console.log(
          "####################################################",
          err,
          "####################################################"
        );
        res.locals.user = null;
        next();
      } else {
        console.log("decodedToken", decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        res.locals.xyz = "XXXYYYYZZZZZ";
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };
