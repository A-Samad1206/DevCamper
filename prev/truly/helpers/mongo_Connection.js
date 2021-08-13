const mongoose = require('mongoose');

let DB = `mongodb+srv://learn:imsamad@cluster0.ttj9v.mongodb.net/devcamper?retryWrites=true&w=majority`;
module.exports = mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection.on('connected', () => {
  console.log('Mongoose Connected To DB');
});
mongoose.connection.on('error', (err) => {
  console.log('Error in connection', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});
process.on('SIGNIT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
