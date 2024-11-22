import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './microphoneToggleButton.css'

const MicrophoneToggleButton = React.forwardRef(({ isMicActive, toggleMicrophone, ...props }, ref) => {
    return (
      <button
        onClick={toggleMicrophone}
        className="Button-videocall-microphone"
        ref={ref}
        {...props}
        aria-label={isMicActive ? "Desactivar micrófono" : "Activar micrófono"}
      >
        {isMicActive ? (
          <FaMicrophoneSlash size={24} color="red" />
        ) : (
          <FaMicrophone size={24} color="white" />
        )}
      </button>
    );
});

export default MicrophoneToggleButton;
