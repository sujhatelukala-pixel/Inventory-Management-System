import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import supplierRoutes from './routes/supplier.js';
import productRoutes from './routes/product.js';
import userRoute from './routes/user.js';
import orderRouter from './routes/order.js'
import dashboardRoutes from './routes/dashboard.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoute);
app.use('/api/orders',orderRouter)
app.use('/api/dashboard', dashboardRoutes);

app.listen(process.env.PORT, () => {
    connectDB();
  console.log('Server is running on http://localhost:3000');
});