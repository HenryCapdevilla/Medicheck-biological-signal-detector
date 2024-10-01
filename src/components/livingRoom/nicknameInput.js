// NicknameInput.js
import React, { useState } from 'react';
const NicknameInput = () => {
    const [nickname, setNickname] = useState(''); // Estado para manejar el valor del input

    // Maneja el cambio del input
    const handleInputChange = (event) => {
        setNickname(event.target.value);
    };

    // Maneja el evento click del botón
    const handleContinueClick = () => {
      console.log(`Nickname ingresado: ${nickname}`); // Puedes personalizar esta acción
      // Aquí podrías agregar la lógica adicional que necesites al presionar el botón
    };

    return (
        <div className="box">
            <div className="head-name">Ingresa un nickname</div>
            <input type="text" className="name-field" placeholder="Nickname.." value={nickname} onChange={handleInputChange}/>
            <br/>
            <button className="continue-name" onClick={handleContinueClick}>
                Continuar
            </button>
        </div>
    );
};

export default NicknameInput;
