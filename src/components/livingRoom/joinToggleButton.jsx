import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa'; // Ícono de celular
import './joinToggleButton.css';

const JoinToggleButton = ({ onJoin }) => {
    return (
        <button onClick={onJoin} className='join-call-button'>
            <FaPhoneAlt size={20} color="white" style={{ marginRight: '8px' }} />
            Unirse a la llamada
        </button>
    );
};

export default JoinToggleButton;
