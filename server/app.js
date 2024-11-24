import express  from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';

dotenv.config();
let app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use("", express.static('dist'));
let __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/server/dist')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/server/dist', 'index.html'));
});

connectDB()
.then(() => {
	app.listen(3000);
});
