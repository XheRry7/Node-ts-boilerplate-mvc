import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  timeAccountCreation: {
    type: Number,
    default: Date.now(),
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: String },
  name: { type: String, unique: true, required: true },
});

export const User = mongoose.model('user', userSchema);
