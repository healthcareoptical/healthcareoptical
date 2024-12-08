import { Schema, model } from 'mongoose';

/**
 * Mongoose Model for the `Brand` collection.
 *
 * This model provides access to the `brands` collection in the MongoDB database.
 * It allows for operations such as creating, reading, updating, and deleting brand documents.
 * The model uses the schema defined above (`brandSchema`) for document structure.
 * 
 * @type {Model}
 * @see {@link https://mongoosejs.com/docs/models.html}
 * @example
 * // Query to find a brand by name
 * Brand.findOne({ brandNameEn: 'Brand Name' });
 * 
 * // Query to find all brands with active status
 * Brand.find({ status: 'A' });
 */

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