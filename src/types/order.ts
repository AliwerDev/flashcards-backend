import mongoose from 'mongoose';
import { Product } from './product';
import { User } from './user';

interface ProductOrder {
  product: Product;
  quantity: number;
}

export interface Order extends mongoose.Document {
  owner: User;
  totalPrice: number;
  status: string;
  products: ProductOrder[];
}
