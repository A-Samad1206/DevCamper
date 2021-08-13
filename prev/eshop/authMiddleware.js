import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"
export const protect=asyncHandler(async(req,res,next)=>{
  /* req.headers.authorization || req.headers.Authorization both render same result */
  let token=req.headers.authorization!=undefined && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(" ")[1]:false
  if(token){
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decode.id).select('-password')
        if(user){
          req.user=user
        }
        else{
          res.json(422)
          throw new Error("Log In & Try again...!")
        }
      }
    catch(err){
      console.error(err)
      res.status(422)
      console.log(err.message)
      throw new Error("Try again...!")
    }
  }
  else{
    res.status(401)
    throw new Error("Not Authorized, no token")
  }
  next()
})

export const admin=asyncHandler((req,res,next)=>{
  if(req.user && req.user.isAdmin){
    next()
  }
  else{
    res.status(401)
    throw new Error('Not authorized as an admin...!')
  }
})