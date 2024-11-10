import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useAuth } from '../../context/AuthContext';
import './clinicalHistoryButton.css'
const ClinicalHistoryButton = () => {
  const { handleUploadHistory, user } = useAuth();
  const { register, handleSubmit } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const onSubmit = async (data) => {
    const formData = {
      patientName: data.name,
      age: parseInt(data.age),
      diagnosis: data.diagnosis,
      history: data.history,
      nip: user.nip,
    };

    try {
      await handleUploadHistory(formData);
      alert('Historia clínica subida exitosamente.');
      closeModal();
    } catch (error) {
      alert('Error al guardar la historia clínica. Intente nuevamente.');
      console.error('Error al guardar la historia clínica:', error);
    }
  };

  return (
    <div>
      <button onClick={openModal}>Abrir Formulario de Historia Clínica</button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Historia Clínica del Paciente</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name">Nombre del Paciente:</label>
              <input type="text" id="name" required {...register('name')} />

              <label htmlFor="age">Edad:</label>
              <input type="number" id="age" required {...register('age')} />

              <label htmlFor="diagnosis">Diagnóstico:</label>
              <input type="text" id="diagnosis" required {...register('diagnosis')} />

              <label htmlFor="history">Historia Clínica:</label>
              <textarea id="history" rows="4" required {...register('history')}></textarea>

              <button type="submit">Guardar</button>
              <button type="button" onClick={closeModal}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalHistoryButton;
