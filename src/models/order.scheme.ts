import mongoose from 'mongoose';

export const OrderScheme = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalPrice: Number,
    status: String,
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
      },
    ],
  },
  { timestamps: true },
);
