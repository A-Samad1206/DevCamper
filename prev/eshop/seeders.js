import mongoose from "mongoose"
import dotenv from 'dotenv'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
// import Order from './models/orderModel.js'
import connectDB from './config/db_conn.js'
dotenv.config()
connectDB()
const importData=async()=>{
  try{
    await User.deleteMany()
    await Product.deleteMany()
    // await Order.deleteMany()

   const createdUser=await User.insertMany(users)
   const adminUser= createdUser[0]._id;

   const sampleProducts=products.map((product)=>{
     return {...product,user:adminUser}
   })
   await Product.insertMany(sampleProducts)
   console.log('Data import')
   process.exit()

  }
  catch(error){
    console.log(`${error.message}`)
    process.exit(1)
  }
}
// importData()
const destroyData=async()=>{
  try{
    await User.deleteMany()
   await Product.deleteMany()
  //  await Order.deleteMany()
   console.log('Data Destroyed')
   process.exit()
  }
  catch(error){
    console.log(`${error.message}`)
    process.exit(1)
  }
}

if(process.argv[2]==='-d'){
  destroyData()
}
else{
  importData()
}