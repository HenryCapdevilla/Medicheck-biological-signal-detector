import React, { useState, useEffect } from 'react';
import CrearNuevoBoton from './Crear_boton';
import './displayButtons.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redireccionar

const DisplayButtons = () => {
    const [inputText, setInputText] = useState(''); // Estado para manejar el texto ingresado
    const [roomID, setRoomID] = useState(null); // Estado para almacenar el ID de la sala
    const [redirectToRoom, setRedirectToRoom] = useState(false); // Estado para manejar la redirección
    const navigate = useNavigate(); // Hook para redirección

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
        console.log('El roomID ingresado es:' + inputText);
        // Aquí puedes manejar la lógica para unirse a la sala con el código ingresado
    };

    // Efecto para manejar la redirección cuando redirectToRoom es true
    useEffect(() => {
        if (redirectToRoom && roomID) {
            // Agregar un pequeño retraso de 1 segundo antes de redirigir
            const timer = setTimeout(() => {
                navigate(`/videollamada/${roomID}`); // Redirigir usando useNavigate
            }, 1000); // 1000 milisegundos = 1 segundo

            return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
        }
    }, [redirectToRoom, roomID, navigate]); // Dependencias del efecto

    return (
        <div className='Display-buttons-call'>
            {/* Botón para crear una nueva sala */}
            <CrearNuevoBoton
                title='Crear nueva sala'
                icon='faCamera'
                id={roomID} // Pasar el roomID como prop al hijo
                redirect={redirectToRoom} // Estado para permitir redirección
                onClick={handleCreateRoomClick} // Asignar la función de clic para crear una sala
            />
            
            {/* Input para ingresar el código de sala */}
            <div className='input-container'>
                <input
                    type='text'
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder='Ingrese código de sala'
                    className='input-field' // Agregar clase para estilos adicionales si es necesario
                />
            </div>

            {/* Botón para unirse a una sala existente */}
            <CrearNuevoBoton
                title='Unirse'
                onClick={handleJoinButtonClick} // Asignar la función de clic para unirse a una sala
            />
        </div>
    );
};

export default DisplayButtons;
