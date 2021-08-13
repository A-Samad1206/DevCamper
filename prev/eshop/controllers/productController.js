import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//  Desc    Fetach All Products
//  Route  GET /api/products/
//  Access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//  Desc   Fetach Single Product By Id
//  Route  GET /api/products/:id
//  Access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product Not Found');
  }
});
//  Desc   Delete Single Product By Id
//  Route  DELETE /api/products/:id
//  Access  Public/Protect/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const result = await product.delete();
    if (result) {
      res.json({ message: 'Product removed.' });
    } else {
      res.status(404);
      throw new Error('Product Not Removed');
    }
  } else {
    res.status(404);
    throw new Error('Product Not Found');
  }
});

//  Desc   Create a product By admin
//  Route  POST /api/products/
//  Access  Public/Protect/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc  Update a product
// @route PUT api/products/:id
// @access Private/admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    (product.name = name || product.name),
      (product.price = price || product.price),
      (product.description = description || product.description);
    (product.brand = brand || product.brand),
      (product.image = image || product.image),
      (product.category = category || product.category),
      (product.countInStock = countInStock || product.countInStock);
    const updatedProduct = await product.save();
    updateProduct && res.status(201).json({ message: 'Product Updated' });
  } else {
    res.status(404);
    throw new Error('Product not found.');
  }
});

// @desc  Create New Review For Product
// @route PUT api/products/:id/review
// @access Private/protect
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(404);
      throw new Error('Product already reviewed.,Thank You');
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      const result = await product.save();
      if (result) {
        res.status(201).json({ message: 'Thankyou for your reviews' });
      }
    }
  } else {
    res.status(404);
    throw new Error('Product not found.');
  }
});
