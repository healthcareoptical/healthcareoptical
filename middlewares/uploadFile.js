import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { put } from '@vercel/blob';

dotenv.config();

/**
 * The maximum allowed duration for a file upload (in minutes).
 * @constant {number}
 * 
 * A map of supported MIME types and their respective file extensions.
 * This is used to validate the file types during the upload process.
 * @type {Object<string, string>}
 */
export const MAX_DURATION = 30;
export const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

/**
 * Middleware for handling file uploads using multer.
 * It stores files in memory and checks whether the MIME type is valid.
 * Files are stored in memory and will be processed in the uploadImage function.
 * 
 * @constant {multer.Multer} upload
 */
export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, callback) {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        if (isValid) {
            callback(null, true);
        } else {
            callback(new Error('Invalid mime type!'));
        }
    }    
});

/**
 * Uploads an image to Vercel Blob Storage.
 * 
 * This function accepts a file, generates a unique filename using UUID, 
 * and uploads the file to Vercel Blob Storage with public access.
 * 
 * @param {Express.Multer.File} file - The file to be uploaded.
 * @returns {Promise<Object>} - A promise that resolves to the blob URL or an error message.
 * 
 * @throws {Error} If an error occurs during the file upload process.
 * 
 * @example
 * // Example usage of the uploadImage function:
 * const result = await uploadImage(file);
 * console.log(result.url);  // Logs the URL of the uploaded image
 */
export async function uploadImage(file) {
    let blob;
    if (file) {
      try {
        const extArray = file.mimetype.split("/");
        const extension = extArray[extArray.length - 1];
        const fileName = uuidv4() + '.' + extension;
        blob = await put("products/" + fileName, file.buffer, {
          access: 'public',
        });
        return blob;
      } catch (err) {
        throw new Error('Image upload failed');
      }
  
    }
    return blob;
}