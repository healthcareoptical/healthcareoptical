import { Schema, model } from 'mongoose';

/**
 * Mongoose Model for the `Role` collection.
 *
 * This model provides access to the `roles` collection in the MongoDB database.
 * It allows for operations such as creating, reading, updating, and deleting role documents.
 * The model uses the schema defined above (`roleSchema`) for document structure.
 * 
 * @type {Model}
 * @see {@link https://mongoosejs.com/docs/models.html}
 * @example
 * // Query to find a role by role ID
 * Role.findOne({ roleId: 1 });
 * 
 * // Query to find all roles with active status
 * Role.find({ status: 'A' });
 */

const roleSchema = new Schema({
  roleId: {
    type: Number,
    required: true
  },
  roleName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  endPoints: [{
    type: String
  }]
},
  {
    timestamps: true,
  }
);

export const Role = model('roles', roleSchema);