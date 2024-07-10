import mongoose from 'mongoose';

export const ProductScheme = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: String,
    amount: Number,
    image: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);
