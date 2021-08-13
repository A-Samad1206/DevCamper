import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  isAdmin:{type:Boolean,required:true,default:false}
},{
  timestamps:true
})

userSchema.statics.isValidPassword = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return true;
    }
    throw Error("Incorrect password")
  }
  throw Error('Incorrect email')
}
userSchema.methods.matchPassword=async function(enteredPassword,res){
    const resu=await bcrypt.compare(enteredPassword, this.password)
    console.log('resu',resu)
    if(resu){
          return resu
    }else{
      res.status(401)
      throw new Error("Invalid password")
    }
}

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')){
    next()
   }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

export default mongoose.model("User",userSchema)