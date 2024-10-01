import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './microphoneToggleButton.css'

const MicrophoneToggleButton = ({ isMicActive, toggleMicrophone }) => {
    return (
        <button onClick={toggleMicrophone} className='Button-videocall-microphone'>
            {isMicActive ? <FaMicrophone size={24} color="red" /> : <FaMicrophoneSlash size={24} color="white"/>}
        </button>
    );
};



export default MicrophoneToggleButton;
