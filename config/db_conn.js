const mongoose = require('mongoose');
const color = require('colors');
const connectDb = async () => {
  //   try{
  const conn = await mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(
    `Connectiion established on w/o Mongo:-${conn.connection.host}`.cyan
      .underline.bold
  );
  //   }
  //   catch(){

  //   }
};
module.exports = connectDb;
