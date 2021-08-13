const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
dotenv.config({ path: '../config/config.env' });
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app = express();
// middleware
app.use(express.static('authNinja/public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
// app.listen(3000)
// database connection
const pword = 'node-auth';
const uname = 'node-auth';
console.log('process.env.DB_URL;', process.env.DB_URL, 'process.env.DB_URL;');
const dbURI =
  'mongodb+srv://' +
  uname +
  ':' +
  pword +
  '@mongodb-practice.gimw9.mongodb.net/node-auth-hash?retryWrites=true&w=majority';
const dbURI1 = "'mongodb://localhost:27017/node-auth-hash";
const dbUR2 = `mongodb+srv://learn:imsamad@cluster0.ttj9v.mongodb.net/devcamper?retryWrites=true&w=majority`;
mongoose
  .connect(dbUR2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(3000, () => console.log('Listening on PORT 3000'));
  });

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
// app.get("/set", (req, res) => {
//   res.cookie("newUser", false, { maxAge: 1000 * 60 * 60 * 24 });
// {
//   , httpOnly: true
//   , secure: true
// }
// res.setHeader('Set-Cookie', 'newUser=true')

//   res.send("Set cokkie");
// });
// app.get("/read", (req, res) => {
//   const cookie = req.cookies;
//   res.json(cookie);
// });
