import mongoose from 'mongoose';

// Configura strictQuery para suprimir la advertencia
mongoose.set('strictQuery', true);

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/medicheckdb');
        console.log('>>> DB is connected');
    } catch (error) {
        console.log(error);
    }
};
