import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useAuth } from '../../context/AuthContext';
import { AiFillFolder } from "react-icons/ai";
import './clinicalHistoryButton.css';

// Envolvemos el componente con React.forwardRef
const ClinicalHistoryButton = React.forwardRef((props, ref) => {
  const { handleUploadHistory, user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: user.firstName + " " + user.secondName + " " + user.firstSurname + " " + user.secondSurname,
    nip: user.nip,
    birthDate: user.birthDate,
    gender: user.gender,
    diagnosis: '',
    history: '',
    medications: '',
    treatment: '',
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const onSubmit = async (data) => {
    try {
      const completeData = { 
        ...formData, 
        ...data 
      };

      await handleUploadHistory(completeData);
      alert('Historia clínica subida exitosamente.');
      closeModal();
    } catch (error) {
      alert('Error al guardar la historia clínica. Intente nuevamente.');
      console.error('Error al guardar la historia clínica:', error);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div>
      <button onClick={openModal} className="Button-history-clinical" ref={ref}>
        <AiFillFolder size={24} color="white" />
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>Historia Clínica del Paciente</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Información Básica */}
              {step === 1 && (
                <div className="single-column">
                  <label>Nombre del Paciente:</label>
                  <div className="readonly">{formData.patientName}</div>

                  <label>Número de Identificación (NIP):</label>
                  <div className="readonly">{formData.nip}</div>

                  <label>Fecha de Nacimiento:</label>
                  <div className="readonly">{formData.birthDate}</div>

                  <label>Sexo:</label>
                  <div className="readonly">{formData.gender}</div>

                  <div className="navigation-buttons">
                    <button type="button" onClick={nextStep}>Siguiente</button>
                  </div>
                </div>
              )}

              {/* Información Detectada */}
              {step === 2 && (
                <div className="single-column">
                  <div>
                    <label htmlFor="diagnosis">Diagnóstico:</label>
                    <input
                      type="text"
                      id="diagnosis"
                      {...register('diagnosis', { required: 'El diagnóstico es obligatorio.' })}
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    />
                    {errors.diagnosis && <p className="error">{errors.diagnosis.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="history">Historia Clínica:</label>
                    <textarea
                      id="history"
                      rows="4"
                      {...register('history', { required: 'La historia clínica es obligatoria.' })}
                      value={formData.history}
                      onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                    ></textarea>
                    {errors.history && <p className="error">{errors.history.message}</p>}
                  </div>

                  <div className="navigation-buttons">
                    <button type="button" onClick={prevStep}>Anterior</button>
                    <button type="button" onClick={nextStep}>Siguiente</button>
                  </div>
                </div>
              )}

              {/* Medicamentos y Tratamiento */}
              {step === 3 && (
                <div className="single-column">
                  <div>
                    <label htmlFor="medications">Medicamentos:</label>
                    <input
                      type="text"
                      id="medications"
                      {...register('medications', { required: 'Los medicamentos son obligatorios.' })}
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    />
                    {errors.medications && <p className="error">{errors.medications.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="treatment">Tratamiento:</label>
                    <input
                      type="text"
                      id="treatment"
                      {...register('treatment', { required: 'El tratamiento es obligatorio.' })}
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    />
                    {errors.treatment && <p className="error">{errors.treatment.message}</p>}
                  </div>

                  <div className="navigation-buttons">
                    <button type="button" onClick={prevStep}>Anterior</button>
                    <button type="submit">Guardar</button>
                  </div>
                </div>
              )}
            </form>

            {/* Puntos de navegación */}
            <div className="navigation-dots">
              <span className={step === 1 ? 'active' : ''} onClick={() => setStep(1)}></span>
              <span className={step === 2 ? 'active' : ''} onClick={() => setStep(2)}></span>
              <span className={step === 3 ? 'active' : ''} onClick={() => setStep(3)}></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ClinicalHistoryButton;
