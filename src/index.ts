import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';
import { authRoutes } from './routes/authRoutes';
import { reviewRoutes } from './routes/reviewRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { brandRoutes } from './routes/brandRoutes';
import { cartRoutes } from './routes/cartRoutes';

dotenv.config();
const port = process.env.SERVERPORT || 3000

const app = express();
const IMAGES_DIR = path.resolve(process.cwd(), "assets", "images");
app.use("/images", express.static(IMAGES_DIR));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});