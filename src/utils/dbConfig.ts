import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MongoDB connection error: MONGO_URI is not defined');
} else {
    mongoose.connect(mongoURI).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
}
