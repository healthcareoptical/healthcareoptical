import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { put } from '@vercel/blob';

dotenv.config();

export const MAX_DURATION = 30;
export const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

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
        console.log('err ' , err)
      }
  
    }
    return blob;
}