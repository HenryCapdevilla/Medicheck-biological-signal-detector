import React from 'react';
import './Crear_boton_1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faKeyboard, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link

// Diccionario de iconos
const iconDictionary = {
    faCamera: faCamera,
    faKeyboard: faKeyboard,
    faCoffee: faCoffee,
};

// Función que asigna la variable del gradiente según el título
const getGlowVariable = (title) => {
    switch (title) {
        case 'Crear nueva sala':
            return 'linear-gradient(45deg, rgb(255, 0, 0), rgb(70, 0, 0), rgb(255, 0, 0), rgb(255, 255, 255), rgb(255, 0, 0), rgb(70, 0, 0), rgb(255, 0, 0), rgb(255, 255, 255))';
        case 'Unirse':
            return 'linear-gradient(45deg, rgb(0, 255, 0), rgb(0, 70, 0), rgb(0, 255, 0), rgb(255, 255, 255), rgb(0, 255, 0), rgb(0, 70, 0), rgb(0, 255, 0), rgb(255, 255, 255))';
        default:
            return ''; // Si no coincide, no asigna glow
    }
};

const CrearNuevoBoton = (props) => {
    const icon = iconDictionary[props.icon];
    const glowVariable = getGlowVariable(props.title); // Obtén el gradiente

    return (
        <button className='Button-call' style={{ '--glow-gradient': glowVariable }} onClick={props.onClick}>   
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {props.redirect && props.id ? (
                <Link to={`/videollamada/${props.id}`}>
                    {icon && <FontAwesomeIcon icon={icon} />} {/* Renderiza el icono si existe */}
                    {props.title}
                </Link>
            ) : (
                <>
                    {icon && <FontAwesomeIcon icon={icon} />} {/* Renderiza el icono si existe */}
                    {props.title}
                </>
            )}
        </button>
    );
};

export default CrearNuevoBoton;