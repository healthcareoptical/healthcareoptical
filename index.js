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


const app = express();
dotenv.config();

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

//middleware for cookies
app.use(cookieParser());

//Use helmet
app.use(helmet());

//Route login to authRoute
app.use('/auth', authRoute);

//Route user to userRoute
app.use('/user', userRoute);

//Route category to categoryRoute
app.use('/category', categoryRoute);

//Route brand to brandRoute
app.use('/brand', brandRoute);

//Route product to productRoute
app.use('/product', productRoute);

//Route menu to menuRoute
app.use('/menu', menuRoute);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.errorMessage;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


const port = parseInt(process.env.PORT) || 3000;

mongoose
  .connect(
    process.env.MONGO_URI || ''
  )
  .then(result => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch(err => console.log(err));
