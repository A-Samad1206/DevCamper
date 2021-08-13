const mongoose = require('mongoose');
const mongoPath =
  'mongodb+srv://learn:imsamad@cluster0.ttj9v.mongodb.net/revision?retryWrites=true&w=majority';

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
};
