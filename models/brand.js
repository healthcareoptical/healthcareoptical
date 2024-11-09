import { Schema, model } from 'mongoose';

const brandSchema = new Schema({
    brandNameZh: {
    type: String
  },
  brandNameEn: {
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

export const Brand = model('brands', brandSchema);