import { Schema, model } from 'mongoose';

/**
 * Mongoose Model for the `User` collection.
 *
 * This model provides access to the `users` collection in the MongoDB database.
 * It allows for operations such as creating, reading, updating, and deleting user documents.
 * The model uses the schema defined above (`userSchema`) for document structure.
 * 
 * @type {Model}
 * @see {@link https://mongoosejs.com/docs/models.html}
 * @example
 * // Query to find a user by user ID
 * User.findOne({ userId: 'john_doe' });
 * 
 * // Query to find all users with active status
 * User.find({ status: 'A' });
 */

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