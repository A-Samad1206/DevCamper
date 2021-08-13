import express from "express"
const router=express.Router()
import {getProducts,getProductById, deleteProduct, updateProduct, createProduct, createProductReview} from "../controllers/productController.js"
import { admin, protect } from "../middlewares/authMiddleware.js"
//  Desc    Fetach All Products
//  Route  GET /api/products/ 
//  Access  Public
router.route("/").get(getProducts).post(protect,admin,createProduct)

//  Desc   Fetach Single Product By Id
//  Route  GET /api/products/:id 
//  Access  Public
router.route("/:id/review").post(protect,createProductReview)
router.route('/:id').get(getProductById).delete(protect,admin,deleteProduct).put(protect,admin,updateProduct)
export default router;