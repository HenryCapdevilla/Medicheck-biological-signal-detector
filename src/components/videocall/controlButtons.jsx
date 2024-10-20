import React from 'react';
import CameraToggleButton from '../livingRoom/cameraToggleButton';
import MicrophoneToggleButton from '../livingRoom/microphoneToggleButton';
import RecordVideoToggleButton from './recordVideoUser';
import SignalToggleButton from './signalToggleButton';

const ControlButtons = ({ isCameraActive, toggleCamera, isMicActive, toggleMicrophone, toggleSignal, onHeartRateUpdate }) => (
    <div className="display-buttons">
        <CameraToggleButton isCameraActive={isCameraActive} toggleCamera={toggleCamera} />
        <MicrophoneToggleButton isMicActive={isMicActive} toggleMicrophone={toggleMicrophone} />
        <RecordVideoToggleButton onHeartRateUpdate={onHeartRateUpdate} />
        <SignalToggleButton toggleSignal={toggleSignal} />
    </div>
);

export default ControlButtons;
