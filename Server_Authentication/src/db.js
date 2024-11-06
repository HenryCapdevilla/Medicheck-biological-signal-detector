import mongoose from 'mongoose';

// Configura strictQuery para suprimir la advertencia
mongoose.set('strictQuery', true);

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/medicheckdb');
        console.log('>>> DB is connected');
    } catch (error) {
        console.log(error);
    }
};
