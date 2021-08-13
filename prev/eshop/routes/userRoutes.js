import express from "express"
const router=express.Router()
import {authUser, deleteUser, getUserById, getUserProfile, getUsers, registerUser, updateUser, updateUserProfile} from "../controllers/userController.js"
import { admin, protect } from "../middlewares/authMiddleware.js"

/*Sign Up Route */
router.route("/").post(registerUser).get(protect,admin,getUsers)
router.route("/profile").get(protect,getUserProfile).put(protect,updateUserProfile)
router.route("/:id").delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUser)

router.route("/login").post(authUser)
// @Desc Get User Profile with token 
export default router;