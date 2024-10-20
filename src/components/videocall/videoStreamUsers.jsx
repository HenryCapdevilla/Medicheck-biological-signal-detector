import React from 'react';

const VideoStream = ({ isCameraActive, videoRef, message, isSignalActive }) => {
    return (
        <div className='video-container'>
            {!isCameraActive && <h1 className={`Camera-off-text ${isSignalActive ? 'signal-active' : ''}`}>{message}</h1>}
            <video ref={videoRef} className="video-Self" autoPlay muted playsInline></video>
        </div>
    );
};

export default VideoStream;
