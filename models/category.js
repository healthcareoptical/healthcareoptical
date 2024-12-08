import { Schema, model } from 'mongoose';

/**
 * Mongoose Model for the `Category` collection.
 *
 * This model provides access to the `categories` collection in the MongoDB database.
 * It allows for operations such as creating, reading, updating, and deleting category documents.
 * The model uses the schema defined above (`categorySchema`) for document structure.
 * 
 * @type {Model}
 * @see {@link https://mongoosejs.com/docs/models.html}
 * @example
 * // Query to find a category by name
 * Category.findOne({ categoryNameEn: 'Category Name' });
 * 
 * // Query to find all categories with active status
 * Category.find({ status: 'A' });
 */
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