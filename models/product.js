import { Schema, model } from 'mongoose';

/**
 * Mongoose Model for the `Product` collection.
 *
 * This model provides access to the `products` collection in the MongoDB database.
 * It allows for operations such as creating, reading, updating, and deleting product documents.
 * The model uses the schema defined above (`productSchema`) for document structure.
 * 
 * @type {Model}
 * @see {@link https://mongoosejs.com/docs/models.html}
 * @example
 * // Query to find a product by model number
 * Product.findOne({ modelNo: '12345' });
 * 
 * // Query to find all products with active status
 * Product.find({ status: 'A' });
 */

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
      ref: 'categories'
  },
  brand: {
      type: Schema.Types.ObjectId,
      ref: 'brands'
  },
  releaseDate: {
    type: Schema.Types.Date,
    required: true
  }
},
  {
    timestamps: true,
  }
);

export const Product = model('products', productSchema);