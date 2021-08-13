const mongo = require('./mongo');
const userSchema = require('./userSchema');
// console.log('==============================================');
// console.log(process);
// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
const connectDB = async () => {
  mongo().then(async (mongoose) => {
    try {
      console.log('Connected To Mongo DB');
      const add = async () => {
        const user = {
          email: 'test@gmail.com',
          name: 'first',
          password: 'imsamad',
        };
        await new userSchema(user).save();
      };
      await add();
      //   .then(() => console.log('Added'));
    } finally {
      console.log('Close');
      mongoose.connection.close();
    }
  });
};
connectDB();
