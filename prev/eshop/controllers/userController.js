import asyncHandler from "express-async-handler"
import { generateToken } from "../helpers/getToken.js"
import User from "../models/userModel.js"




//  Desc   Register New User
//  Route  GET /api/users 
//  Access  Public
export const registerUser=asyncHandler(async(req,res)=>{
  const {email}=req.body
  // if(email==' ' || password==' ' || name==' ' ){
  //   res.status(422)
  //   throw new Error("Enter all credentials...!")
  // }
  const userExists=await User.findOne({email})
  if(userExists){
    res.status(422)
    throw new Error("User already exist...!")
  }
  else{
    const user=await User.create(req.body)
    if(user){
      res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
      token:generateToken(user._id)
      })
    }
    else{
      res.status(400)
      throw new Error("Invalid data,try again...!")
    }
  }
})



//  Desc   Auth the user & get Token
//  Route  POST /api/user/login 
//  Access  Public
export const authUser=asyncHandler(async(req,res)=>{
  const { email,password } = req.body
  const user=await User.findOne({email})
  if(user &&(await user.matchPassword(password,res)) ){ 
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
      token:generateToken(user._id)
    })
  }else{
    res.status(401)
    throw new Error("Invalid email.")
  }
})
  

//  Desc   Get the user profile with Token
//  Route  GET /api/user/profile 
//  Access  Private
export const getUserProfile=asyncHandler(async(req,res)=>{
  const getUser=await User.findById(req.user._id)
  if(getUser){
    res.json({
      name:getUser.name,
      email:getUser.email,
      isAdmin:getUser.isAdmin,
      token:generateToken(getUser._id) 
    })
  }else{
    res.status(404)
    throw new Error("User not found...!")
  }
})



//  Desc   Update user profile with Token
//  Route  PUT /api/user/profile 
//  Access  Private/Protect
export const updateUserProfile=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user._id)
  if(user){    
      user.name=req.body.name || user.name  
      user.email= req.body.email || user.email
      user.isAdmin=req.body.isAdmin ? req.body.isAdmin:user.isAdmin 
      if(req.body.password){
      user.password=req.body.password
      }
      const updatedUser=await user.save()
      res.json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin,
      token:generateToken(updatedUser._id)
    })
      
  }else{
    res.status(404)
    throw new Error("User not found...!")
  }

})



//  Desc    Get all users By Admin
//  Route   GET /api/users
//  Access  Private/Protect/Admin
export const getUsers=asyncHandler(async(req,res)=>{
  const users=await User.find({})
  if(users){
    res.json(users)
  }
  else{
    res.status(404)
    throw new Error('Users not exists')
  }
})


//  Desc    Delete user By Admin
//  Route   DELETE /api/users/:id
//  Access  Private/Protect/Admin
export const deleteUser=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id)
  if(user){
    const resu=await user.remove()
    if(resu){
      res.json({message:'Deleted Successfully.'})
    }
    else{
      throw new Error('Sorry,server is busy,Try again.')
    }
  }
  else{
    res.status(404)
    throw new Error('Users not found')
  }
})


//  Desc    Get user By ID
//  Route   GET /api/users/:id
//  Access  Private/Protect/Admin
export const getUserById=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id).select('-password')
  if(user){
    res.json(user)
  }
  else{
    res.status(404)
    throw new Error('User does not exists')
  }
})


//  Desc   Update user By Admin
//  Route  PUT /api/user/:id 
//  Access  Private/Protect/admin
export const updateUser=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id)
  if(user){    
      user.name=req.body.name || user.name  
      user.email= req.body.email || user.email
      user.isAdmin=req.body.isAdmin==='on' || req.body.isAdmin  && true
      const updatedUser=await user.save()
      
      res.json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin,
    })
      
  }else{
    res.status(404)
    throw new Error("User not found...!")
  }

})


