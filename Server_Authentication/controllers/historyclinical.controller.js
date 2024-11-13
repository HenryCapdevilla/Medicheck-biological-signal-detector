import ClinicalHistory from '../models/ClinicalHistory.js';

export const uploadData = async (req, res) => {
  try {
    console.log(req.body); // Verifica los datos recibidos
    const { patientName, birthDate, gender, diagnosis, history, medications, treatment, nip } = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!patientName || !birthDate || !gender || !diagnosis || !history || !medications || !treatment || !nip) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    // Verificar si ya existe una historia clínica con el mismo NIP
    const existingHistory = await ClinicalHistory.findOne({ nip });
    if (existingHistory) {
      return res.status(400).json({ error: 'Ya existe una historia clínica con este NIP' });
    }

    // Crear una nueva historia clínica
    const newHistory = new ClinicalHistory({
      patientName,
      birthDate,
      gender,
      diagnosis,
      history,
      medications,
      treatment,
      nip
    });
    await newHistory.save();

    res.status(201).json({ message: 'Historia clínica guardada exitosamente' });
  } catch (error) {
    console.error('Error al guardar la historia clínica:', error);
    res.status(500).json({ error: 'Error al guardar la historia clínica', details: error.message });
  }
};

// Ruta para consultar una historia clínica por paciente
export const donwloadData = async (req, res) => {
  try {
    const history = await ClinicalHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    res.json(history);
  } catch (error) {
    console.error('Error al obtener la historia clínica:', error);
    res.status(500).json({ error: 'Error al obtener la historia clínica' });
  }
};

// Ruta para actualizar una historia clínica (sin eliminar datos previos)
export const updateData = async (req, res) => {
  try {
    const { diagnosis, history: newHistory, medications, treatment } = req.body;
    const history = await ClinicalHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ error: "Historia clínica no encontrada" });

    // Actualizar solo los campos proporcionados en la solicitud
    if (diagnosis) history.diagnosis = diagnosis;
    if (newHistory) history.history += `\n${newHistory}`; // Concatenar nuevo historial al existente
    if (medications) history.medications = medications;
    if (treatment) history.treatment = treatment;

    await history.save();
    res.json({ message: "Historia clínica actualizada exitosamente" });
  } catch (error) {
    console.error('Error al actualizar la historia clínica:', error);
    res.status(500).json({ error: "Error al actualizar la historia clínica" });
  }
};
