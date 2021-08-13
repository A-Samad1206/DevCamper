const mongoose = require('mongoose');
const reqObj = {
  type: String,
  required: true,
};
const userSchema = mongoose.Schema({
  email: reqObj,
  name: reqObj,
  password: reqObj,
});
module.exports = mongoose.model('xyz', userSchema);
