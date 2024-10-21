import React, { useRef, useEffect } from 'react';

const RemoteVideo = ({ remoteStream }) => {
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div>
            <video 
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: 'auto' }} 
            />
        </div>
    );
};

export default RemoteVideo;
