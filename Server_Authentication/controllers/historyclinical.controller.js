import ClinicalHistory from '../models/ClinicalHistory.js';

export const uploadData = async (req, res) => {
  try {
    console.log(req.body); // Verifica los datos recibidos
    let { patientName, age, diagnosis, history, nip } = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!patientName || !age || !diagnosis || !history || !nip) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    // Verificar si ya existe una historia clínica con el mismo NIP
    const existingHistory = await ClinicalHistory.findOne({ nip });
    if (existingHistory) {
      return res.status(400).json({ error: 'Ya existe una historia clínica con este NIP' });
    }

    // Crear una nueva historia clínica
    const newHistory = new ClinicalHistory({ patientName, age, diagnosis, history, nip });
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
      res.status(500).json({ error: 'Error al obtener la historia clínica' });
    }
  };
  
// Ruta para actualizar una historia clínica (sin eliminar datos previos)
export const updateData = async (req, res) => {
  try {
    const { history: newEntry } = req.body;
    const history = await ClinicalHistory.findById(req.params.id);
    if (!history)
      return res.status(404).json({ error: "Historia clínica no encontrada" });

    // Concatenar el nuevo historial al existente
    history.history += `\n${newEntry}`;
    await history.save();
    res.json({ message: "Historia clínica actualizada" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la historia clínica" });
  }
};
