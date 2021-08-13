import mongoose from 'mongoose';
const reqString = {
  type: String,
  required: true,
};

const reviewSchema = mongoose.Schema(
  {
    name: reqString,
    rating: { type: Number, required: true },
    comment: reqString,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: reqString,
    image: reqString,
    brand: reqString,
    category: reqString,
    description: reqString,
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Product', ProductSchema);
