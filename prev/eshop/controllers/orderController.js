import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//  Desc    Create New Order
//  Route   POST /api/orders/
//  Access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items.');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//  Desc    Get Order By Id
//  Route   GET /api/orders/:id
//  Access  Private/Protect
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order does not exist');
  }
});

//  Desc    Update order to piad
//  Route   GET /api/orders/:id /pay
//  Access  Private/Protect
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (req.body.paid) {
      order.isPaid = req.body.paid;
      order.paidAt = Date.now();
      order.paymentMethod = req.body.paymentMethod || 'payapl';
      order.paymentResult = {
        payerID: req.body.payerID,
        paymentID: req.body.paymentID,
        paymentToken: req.body.paymentToken,
        email: req.body.email,
        returnUrl: req.body.returnUrl,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Transaction failed.');
    }
  } else {
    res.status(404);
    throw new Error('Order does not exist');
  }
});

//  Desc    Update order to delivered
//  Route   GET /api/orders/:id/deliver
//  Access  Private/Protect/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    if (updatedOrder) {
      res.json({ message: 'Updated To Delivered' });
    } else {
      res.status(404);
      throw new Error('Failed server is busy,Try again.');
    }
  } else {
    res.status(404);
    throw new Error('Order does not exist');
  }
});

//  Desc    Get logged in orders
//  Route   GET /api/orders/myorders
//  Access  Private/Protect
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('You does not order anything till now.');
  }
});

//  Desc    Get all in orders by admin
//  Route   GET /api/orders/
//  Access  Private/Protect/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('You does not order anything till now.');
  }
});
