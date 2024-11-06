import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['medico', 'paciente'], // Solo permite estos dos valores
        required: true, // Asegura que se defina el rol al registrar un usuario
        default: 'paciente' // Valor predeterminado en caso de que no se especifique
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
