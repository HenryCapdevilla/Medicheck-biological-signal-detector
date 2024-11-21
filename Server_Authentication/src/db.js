import mongoose from 'mongoose';

// Configura strictQuery para suprimir la advertencia
mongoose.set('strictQuery', true);

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://46.202.93.182:27017/medicheckdb');
        console.log('>>> DB is connected');
    } catch (error) {
        console.log(error);
    }
};
