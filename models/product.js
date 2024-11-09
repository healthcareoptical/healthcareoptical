import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  modelNo: {
    type:String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  prodDescEn: {
    type: String,
    required: true
  },
  prodDescZh: {
    type: String
  },
  prodNameEn: {
    type: String,
    required: true
  },
  prodNameZh: {
    type: String
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  category: {
      type: Schema.Types.ObjectId,
      ref: 'categorys'
  },
  brand: {
      type: Schema.Types.ObjectId,
      ref: 'brands'
  }
},
  {
    timestamps: true,
  }
);

export const Product = model('products', productSchema);