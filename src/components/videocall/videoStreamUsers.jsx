import React from 'react';

const VideoStream = ({ isCameraActive, videoRef, message, isSignalActive }) => {
    return (
        <div className='video-container'>
            {!isCameraActive && (
                <div id="camera-off-message" className={`Camera-off-text ${isSignalActive ? 'signal-active' : ''}`}>
                    {message}
                </div>
            )}
            <video ref={videoRef} className="video-Self" autoPlay muted playsInline></video>
        </div>
    );
};

export default VideoStream;
