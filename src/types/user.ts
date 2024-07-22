import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  name: string;
  email: string;
  picture: string;
  readonly password: string;
}
