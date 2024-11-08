import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nip: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Asegura que el NIP sea único
    },
    role: {
			type: String,
      enum: ['admin', 'paciente', 'medico'],
      default:'paciente',
		}, // Campo para rol de administrador
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
