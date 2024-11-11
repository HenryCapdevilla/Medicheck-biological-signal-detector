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
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin', 'paciente', 'medico'],
      default: 'paciente',
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    secondName: {
      type: String,
      trim: true,
    },
    firstSurname: {
      type: String,
      required: true,
      trim: true,
    },
    secondSurname: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
