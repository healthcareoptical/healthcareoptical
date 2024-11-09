import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  categoryNameZh: {
    type: String
  },
  categoryNameEn: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
},
  {
    timestamps: true,
  }
);

export const Category = model('categories', categorySchema);