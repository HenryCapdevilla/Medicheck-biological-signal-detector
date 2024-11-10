import mongoose from 'mongoose';

const clinicalHistorySchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  age: {
    type: Number, // Asegúrate de que sea un Number
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  history: {
    type: String,
    required: true,
  },
  nip: {
	type: String,
	required: true,
	trim: true,
	unique: true, // Asegura que el NIP sea único
  },
}, {
  timestamps: true, // Agrega timestamps para la fecha de creación y actualización
});

const ClinicalHistory = mongoose.model('ClinicalHistory', clinicalHistorySchema);

export default ClinicalHistory;
