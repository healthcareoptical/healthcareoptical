import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  password: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'roles'
    }
  ]
},
  {
    timestamps: true,
  }
);

export const User = model('users', userSchema);