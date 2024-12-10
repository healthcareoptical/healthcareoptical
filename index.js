import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import brandRoute from './routes/brandRoute.js';
import productRoute from './routes/productRoute.js';
import menuRoute from './routes/menuRoute.js';
import emailRoute from './routes/emailRoute.js';

const app = express();
dotenv.config();

/**
 * Middleware to handle URL-encoded form data and JSON payloads.
 */
app.use(express.urlencoded());
app.use(express.json());

/**
 * CORS middleware configuration to allow cross-origin requests.
 * @param {Object} origin - The origin of the request.
 * @param {Function} callback - The callback function to allow or reject the request.
 */
const allowedOrigins = process.env.ALLOW_ORIGINS || ["https://healthcareopticalweb.vercel.app"];
const env = process.env.ENV || 'dev';
app.use(cors(
  ({
    origin: (origin, callback) => {
      console.log('env ',env);
      console.log('Received Origin:', origin);
      if (env === 'dev') {
        callback(null, true);
      } else {
        console.log('see' , allowedOrigins.indexOf(origin || ""))
        if (allowedOrigins.indexOf(origin || "") !== -1) {
          console.log('allowedOrigins ',allowedOrigins);
          callback(null, true)
        } else {
          console.log('return error');
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
));


/**
 * Middleware to parse cookies from incoming requests.
 */
app.use(cookieParser());

/**
 * Helmet middleware to secure HTTP headers for protecting the application.
 */
app.use(helmet());

/**
 * Route for handling user authentication and login-related actions.
 */
app.use('/auth', authRoute);

/**
 * Route for managing user-related actions such as creation, update, and deletion.
 */
app.use('/user', userRoute);

/**
 * Route for managing categories of products.
 */
app.use('/category', categoryRoute);

/**
 * Route for managing product brands.
 */
app.use('/brand', brandRoute);

/**
 * Route for managing products, including details like prices and descriptions.
 */
app.use('/product', productRoute);

/**
 * Route for managing menu-related operations.
 */
app.use('/menu', menuRoute);

/**
 * Route for sending email notifications and other email-related actions.
 */
app.use('/email', emailRoute);

/**
 * Error handling middleware for catching any errors during request processing.
 * @param {Object} error - The error object containing details of the error.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.errorMessage;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


const port = parseInt(process.env.PORT) || 3000;

/**
 * Connect to MongoDB and start the Express server.
 * If the connection is successful, the server starts on the configured port.
 * @returns {Promise<void>} - A promise that resolves once the server starts.
 */
mongoose
  .connect(
    process.env.MONGO_URI || ''
  )
  .then(result => {
    app.listen(port, () => {
      console.log(`listening on port ${port}!`);
    });
  })
  .catch(err => console.log(err));
