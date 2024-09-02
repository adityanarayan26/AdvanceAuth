import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDb } from './db/ConnectDb.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRoutes);



app.listen(PORT, (req, res) => {
    connectDb()
    console.log(`Server started on port ${PORT}`);
})