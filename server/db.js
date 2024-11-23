import mongoose from 'mongoose';

export default function connectDB () {
	return mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('MongoDB connected successfully');
	})
	.catch((error) => {
		console.error('Error connecting to database:', error.message);
	});
};