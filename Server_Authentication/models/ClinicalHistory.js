import mongoose from 'mongoose';

const clinicalHistorySchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  nip: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Asegura que el NIP sea único
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'], // Opciones para género
  },
  diagnosis: {
    type: String,
    required: true,
  },
  history: {
    type: String,
    required: true,
  },
  medications: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  }
}, {
  timestamps: true, // Agrega timestamps para la fecha de creación y actualización
});

const ClinicalHistory = mongoose.model('ClinicalHistory', clinicalHistorySchema);

export default ClinicalHistory;
