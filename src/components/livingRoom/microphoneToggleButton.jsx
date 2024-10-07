import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './microphoneToggleButton.css'

const MicrophoneToggleButton = ({ isMicActive, toggleMicrophone }) => {
    return (
        <button onClick={toggleMicrophone} className='Button-videocall-microphone'>
            {isMicActive ? <FaMicrophoneSlash size={24} color="red" /> : <FaMicrophone size={24} color="white"/>}
        </button>
    );
};



export default MicrophoneToggleButton;
