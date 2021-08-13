import mongoose from "mongoose"
const reqString={
  type:String,
  required:true
}
const orderSchema=mongoose.Schema({
  user:{type: mongoose.Schema.Types.ObjectId, required:true, ref:"User"},

  orderItems:[{
    name : reqString,
    qty:{type:Number,required:true},
    image:reqString,
    price:{type:Number,required:true},
    product:{type:mongoose.Types.ObjectId,required:true,ref:"Product"},
  }],
  
  shippingAddress:{
    address:reqString,
    city:reqString,
    postalCode:reqString,
    country:reqString
  },
  
  paymentMethod:reqString,

  isPaid:{type:Boolean,required:true,default:false},
  
  paidAt:{type:Date},
    
  paymentResult:{
    payerID:{type:String},
    paymentID:{type:String},
    paymentToken:{type:String},
    email:{type:String},
    returnUrl:{type:String},
  },
  
  taxPrice:{type:Number,required:true,default:0.0},
  
  itemsPrice:{type:Number,required:true,default:0.0},
  
  shippingPrice:{type:Number,required:true,default:0.0},
  
  totalPrice:{type:Number,required:true,default:0.0},
  
  isDelivered:{type:Boolean,required:true,default:false},
  
  deliveredAt:{type:Date},
},{
  timestamps:true
})
export default mongoose.model("Order",orderSchema)