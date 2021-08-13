{
  lowercase: true;
}
//  GEN hASHED PASSWORD
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password, salt);

//   Gen string for Cookie
return jwt.sign({ id }, 'secret-key', {
  expiresIn: maxAge,
});

//Compare the password of incoming sign-in form and stored in DB
const auth = await bcrypt.compare(password, user.password);

//Compasre the cookie wether valid or manipulated.
jwt.verify(token, 'secret-key', (err, decodedToken) => {
  if (err) {
    console.log(err);
    res.redirect('/login');
  } else {
    console.log('Decode token', decodedToken);
    next();
  }
});

//Signup
// 0.1) Hash Password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// 0.2) generate string for cookie
const generateToken = (id) => {
  return jwt.sign({ id }, 'secret-key', {
    expiresIn: maxAge,
  });
};
//------------------------------------------//
// Login
// 0.1)Compare hased  password
userSchema.statics.login = async function (email, password) {
  // console.log("statics");
  //   const { email, password } = req.body;
  const user = await this.findOne({ email });
  //   const user = await User.findOne({ email });
  if (user) {
    // console.log("Eamil");
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      // console.log("password", user._id);
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};
//  Check incoming cookie
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret-key', (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect('/login');
      } else {
        console.log('Decode token', decodedToken);
        next();
      }
    });
  } else {
    console.log('No such cookie exist');
    res.redirect('/login');
  }
};
