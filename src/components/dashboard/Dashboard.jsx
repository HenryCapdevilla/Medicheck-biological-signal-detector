import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [nip, setNip] = useState('');
    const [clinicalHistory, setClinicalHistory] = useState(null);
    const [editData, setEditData] = useState({
      diagnosis: '',
      history: '',
      medications: '',
      treatment: ''
    });
  
    // Función para buscar la historia clínica por NIP
    const handleSearch = async () => {
      try {
        const response = await axios.get(`/clinical-history/${nip}`);
        setClinicalHistory(response.data);
        setEditData({
          diagnosis: response.data.diagnosis,
          history: response.data.history,
          medications: response.data.medications,
          treatment: response.data.treatment
        });
      } catch (error) {
        alert('Historia clínica no encontrada.');
        console.error('Error al buscar la historia clínica:', error);
      }
    };
  
    // Función para actualizar la historia clínica
    const handleUpdate = async () => {
      try {
        await axios.patch(`/clinical-history/${clinicalHistory._id}`, editData);
        alert('Historia clínica actualizada exitosamente.');
        handleSearch(); // Recargar la historia actualizada
      } catch (error) {
        alert('Error al actualizar la historia clínica.');
        console.error('Error al actualizar la historia clínica:', error);
      }
    };
  
    return (
      <div className="clinical-history-manager">
        <h2>Gestión de Historia Clínica</h2>
  
        <div className="search-section">
          <label>Buscar por NIP:</label>
          <input
            type="text"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            placeholder="Ingrese el NIP del paciente"
          />
          <button onClick={handleSearch}>Buscar</button>
        </div>
  
        {clinicalHistory && (
          <div className="history-details">
            <h3>Detalles de Historia Clínica</h3>
            <p><strong>Nombre del Paciente:</strong> {clinicalHistory.patientName}</p>
            <p><strong>Fecha de Nacimiento:</strong> {clinicalHistory.birthDate}</p>
            <p><strong>Sexo:</strong> {clinicalHistory.gender}</p>
            <hr />
  
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Diagnóstico:</label>
                <input
                  type="text"
                  value={editData.diagnosis}
                  onChange={(e) => setEditData({ ...editData, diagnosis: e.target.value })}
                />
              </div>
              <div>
                <label>Historia Clínica:</label>
                <textarea
                  value={editData.history}
                  onChange={(e) => setEditData({ ...editData, history: e.target.value })}
                ></textarea>
              </div>
              <div>
                <label>Medicamentos:</label>
                <input
                  type="text"
                  value={editData.medications}
                  onChange={(e) => setEditData({ ...editData, medications: e.target.value })}
                />
              </div>
              <div>
                <label>Tratamiento:</label>
                <input
                  type="text"
                  value={editData.treatment}
                  onChange={(e) => setEditData({ ...editData, treatment: e.target.value })}
                />
              </div>
              <button onClick={handleUpdate}>Guardar Cambios</button>
            </form>
          </div>
        )}
      </div>
    );
  };
  
export default Dashboard
