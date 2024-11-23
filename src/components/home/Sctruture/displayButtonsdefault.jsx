import React, { useState, useEffect } from 'react';
import CrearNuevoBoton from '../Buttons/Crear_boton';
import './displayButtons.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redireccionar
import { useAuth } from '../../../context/AuthContext';

const DisplayButtonsdefault = () => {
    const [inputText, setInputText] = useState(''); // Estado para manejar el texto ingresado
    const [roomID, setRoomID] = useState(null); // Estado para almacenar el ID de la sala
    const [redirectToRoom, setRedirectToRoom] = useState(false); // Estado para manejar la redirección
    const navigate = useNavigate(); // Hook para redirección
    const { user } = useAuth(); // Obtiene la información del usuario desde el contexto de autenticación

    // Función para manejar el cambio en el campo de entrada
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    // Función para generar un UUID
    const uuidv4 = () => {
        return 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = (c === 'x') ? r : ((r & 0x3) | 0x8); // Agregar paréntesis en la combinación de operadores
            return v.toString(16);
        });
    };

    // Función para manejar el clic en el botón "Crear nueva sala"
    const handleCreateRoomClick = () => {
        const newRoomID = uuidv4(); // Generar un nuevo ID de sala
        console.log('roomID es:' + newRoomID);
        setRoomID(newRoomID); // Guardar el ID en el estado
        setRedirectToRoom(true); // Marcar que se debe redirigir
    };

    // Función para manejar el clic en el botón "Unirse"
    const handleJoinButtonClick = () => {
        if (inputText.trim() === '') {
            alert('Ingrese un código de sala válido');
            return;
        }
        navigate(`/livingroom/${roomID}`); // Redirigir usando useNavigate
    };

    // Efecto para manejar la redirección cuando redirectToRoom es true
    useEffect(() => {
        if (redirectToRoom && roomID) {
            // Agregar un pequeño retraso de 1 segundo antes de redirigir
            const timer = setTimeout(() => {
                navigate(`/livingroom/${roomID}`); // Redirigir usando useNavigate
            }, 1000); // 1000 milisegundos = 1 segundo

            return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
        }
    }, [redirectToRoom, roomID, navigate]); // Dependencias del efecto

    return (
        <div className='Display-buttons-call'>
            {user?.role === 'medico' && ( // Mostrar solo si el rol es médico
                <>
                    <CrearNuevoBoton
                        title='Crear nueva sala'
                        icon='faCamera'
                        id={roomID}
                        redirect={redirectToRoom}
                        onClick={handleCreateRoomClick}
                    />
                    <p className='role-instruction'>Como médico, puedes crear una sala para iniciar una teleconsulta.</p>
                </>
            )}

            {user?.role === 'paciente' && ( // Mostrar solo si el rol es paciente
                <>
                    <div className='input-container'>
                        <input
                            type='text'
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder='Ingrese código de sala'
                            className='input-field'
                        />
                    </div>
                    <CrearNuevoBoton
                        title='Unirse'
                        onClick={handleJoinButtonClick}
                    />
                    <p className='role-instruction'>Como paciente, ingrese el ID de la sala proporcionado por su médico para unirse a la teleconsulta.</p>
                </>
            )}
        </div>
    );
};

export default DisplayButtonsdefault;
