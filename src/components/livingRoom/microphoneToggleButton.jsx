import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import './microphoneToggleButton.css';

const MicrophoneToggleButton = ({ isMicActive, toggleMicrophone }) => {
    return (
        <Tooltip title={isMicActive ? "Mute Mic" : "Unmute Mic"} arrow>
            {/* Se asegura que el ref se pase correctamente */}
            <span>
                <button onClick={toggleMicrophone} className='Button-videocall-microphone'>
                    {isMicActive ? <FaMicrophoneSlash size={24} color="red" /> : <FaMicrophone size={24} color="white"/>}
                </button>
            </span>
        </Tooltip>
    );
};

export default MicrophoneToggleButton;
