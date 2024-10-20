import React from 'react';

const VideoPlayer = ({ videoRef, className, autoPlay = true, message = '', classMessage='' }) => (
    <div className={className}>
        {videoRef && videoRef.current ? (
            <video ref={videoRef} autoPlay={autoPlay} playsInline/>
        ) : (
            <p className={classMessage}>{message}</p>
        )}
    </div>
);

export default VideoPlayer;
