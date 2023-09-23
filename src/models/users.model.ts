import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      enum: ['android', 'ios', 'admin'],
    },

    userName: {
      type: String,
    },

    displayName: {
      type: String,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    FcmToken: {
      type: String,
    },

    active: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
