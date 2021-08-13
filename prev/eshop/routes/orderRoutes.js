import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/orderController.js';
const router = express.Router();
import { admin, protect } from '../middlewares/authMiddleware.js';
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

router.route('/myorders').get(protect, getMyOrders);
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
export default router;
