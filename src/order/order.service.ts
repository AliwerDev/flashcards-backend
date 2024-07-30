import { Injectable } from '@nestjs/common';
import { OrderDTO } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../types/order';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  // Add new order to the database.
  async add(orderDTO: OrderDTO) {
    const order = await this.orderModel.create({
      owner: orderDTO.owner,
      totalPrice: orderDTO.totalPrice,
      products: [orderDTO.product],
    });

    return await order.save();
  }
}
